-- disable unnecessary triggers
-- add ciip_user_organisation connection if not set
-- refresh application data with truncate & create_application_mutation_chain
-- set legal-disclaimer to false to trigger legal checkbox pages
-- update form_result data so that there are no errors & reporter can move through all pages

begin;

delete from ggircs_portal.certification_url where application_id=2;

select test_helper.modify_triggers('enable');

do \$$
  declare disable_triggers json;
  begin
    disable_triggers := '
      {
        "application": ["_send_draft_application_email"],
        "certification_url": ["_signed_by_certifier_email", "_certification_request_email"],
        "application_revision_status": ["_status_change_email"],
        "ciip_user_organisation": ["_send_access_approved_email", "_send_request_for_access_email", "_set_user_id"]
      }
    ';
    perform test_helper.modify_triggers('disable', disable_triggers);
  end;
\$$;

delete from ggircs_portal.ciip_user_organisation where user_id=6 and organisation_id=7;
insert into ggircs_portal.ciip_user_organisation(user_id, organisation_id, status) values (6, 7, 'approved');
truncate ggircs_portal.application restart identity cascade;
select ggircs_portal.create_application_mutation_chain(1);
select ggircs_portal.create_application_mutation_chain(2);
update ggircs_portal.application_revision set legal_disclaimer_accepted = false where application_id=2 and version_number=1;

-- Ensure products referenced in form_result are in the database
truncate ggircs_portal.product restart identity cascade;

select test_helper.create_product(id => 26, product_name => 'Coal', units => 'tonnes', product_state => 'published');
select test_helper.create_product(id => 29, product_name => 'Other Pulp (Mechanical pulp, paper, newsprint)', units => 'bone-dry tonnes', product_state => 'published');

-- Ensure all form results contain no errors
select test_helper.initialize_all_form_result_data(2,1);

commit;
