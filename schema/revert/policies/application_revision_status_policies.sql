-- Revert ggircs-portal:policies/application_revision_policies from pg

begin;

-- ciip_administrator Policies
drop policy 'ciip_administrator_select_application_revision_status' on ggircs_portal.application_revision_status;
drop policy 'ciip_administrator_insert_application_revision_status' on ggircs_portal.application_revision_status;


-- ciip_analyst Policies
drop policy 'ciip_analyst_select_application_revision_status' on ggircs_portal.application_revision_status;
drop policy 'ciip_analyst_insert_application_revision_status' on ggircs_portal.application_revision_status;

-- ciip_industry_user Policies
drop policy 'ciip_industry_user_select_application_revision_status' on ggircs_portal.application_revision_status;
drop policy 'ciip_industry_user_insert_application_revision_status' on ggircs_portal.application_revision_status;

-- ciip_industry_user (certifier) Policies
drop policy 'certifier_select_application_revision_status' on ggircs_portal.application_revision_status;

commit;
