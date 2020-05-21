-- Revert ggircs-portal:policies/ciip_user_organisation_policies from pg

begin;

drop policy ciip_administrator_select_ciip_user_organisation on ggircs_portal.ciip_user_organisation;
drop policy ciip_administrator_insert_ciip_user_organisation on ggircs_portal.ciip_user_organisation;
drop policy ciip_administrator_update_ciip_user_organisation on ggircs_portal.ciip_user_organisation;

drop policy ciip_analyst_select_ciip_user_organisation on ggircs_portal.ciip_user_organisation;
drop policy ciip_analyst_insert_ciip_user_organisation on ggircs_portal.ciip_user_organisation;
drop policy ciip_analyst_update_ciip_user_organisation on ggircs_portal.ciip_user_organisation;

drop policy ciip_industry_user_select_ciip_user_organisation on ggircs_portal.ciip_user_organisation;
drop policy ciip_industry_user_insert_ciip_user_organisation on ggircs_portal.ciip_user_organisation;

commit;