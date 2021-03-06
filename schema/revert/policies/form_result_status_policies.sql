-- Revert ggircs-portal:policies/form_result_status_policies from pg

begin;

drop policy ciip_administrator_select_form_result_status on ggircs_portal.form_result_status;
drop policy ciip_administrator_insert_form_result_status on ggircs_portal.form_result_status;

drop policy ciip_analyst_select_form_result_status on ggircs_portal.form_result_status;
drop policy ciip_analyst_insert_form_result_status on ggircs_portal.form_result_status;

drop policy ciip_industry_user_select_form_result_status on ggircs_portal.form_result_status;
drop policy ciip_industry_user_insert_form_result_status on ggircs_portal.form_result_status;

drop function ggircs_portal_private.get_valid_form_result_status_applications;

commit;
