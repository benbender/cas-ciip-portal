-- Revert ggircs-portal:policies/emission_category_policies from pg

begin;

drop policy ciip_administrator_select_emission_category on ggircs_portal.emission_category;
drop policy ciip_administrator_insert_emission_category on ggircs_portal.emission_category;
drop policy ciip_administrator_update_emission_category on ggircs_portal.emission_category;

drop policy ciip_analyst_select_emission_category on ggircs_portal.emission_category;

drop policy ciip_industry_user_select_emission_category on ggircs_portal.emission_category;

commit;
