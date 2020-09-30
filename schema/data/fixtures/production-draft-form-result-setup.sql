-- disable unnecessary triggers
-- create connection to application via ciip_user_organisation
-- ensure each production form is blank before each test

begin;

select test_helper.modify_triggers('disable');

insert into ggircs_portal.ciip_user_organisation(user_id, organisation_id, status) values (6, 7, 'approved');

update ggircs_portal.form_result set form_result = '[{}]' where id=12;

commit;
