-- Verify ggircs-portal:tables/form_result_status on pg

begin;

select pg_catalog.has_table_privilege('ggircs_portal.form_result_status', 'select');

select pg_get_functiondef('ggircs_portal_private.get_valid_form_result_status_applications()'::regprocedure);

-- ciip_administrator Grants
select ggircs_portal_private.verify_grant('select', 'form_result_status', 'ciip_administrator');
select ggircs_portal_private.verify_grant('insert', 'form_result_status', 'ciip_administrator');

-- ciip_analyst Grants
select ggircs_portal_private.verify_grant('select', 'form_result_status', 'ciip_analyst');
select ggircs_portal_private.verify_grant('insert', 'form_result_status', 'ciip_analyst');

-- ciip_industry_user Grants
select ggircs_portal_private.verify_grant('select', 'form_result_status', 'ciip_industry_user');
select ggircs_portal_private.verify_grant('insert', 'form_result_status', 'ciip_industry_user');

-- ciip_guest Grants

-- ciip_administrator Policies
select ggircs_portal_private.verify_policy('select', 'ciip_administrator_select_form_result_status', 'form_result_status', 'ciip_administrator');
select ggircs_portal_private.verify_policy('insert', 'ciip_administrator_insert_form_result_status', 'form_result_status', 'ciip_administrator');

-- ciip_analyst Policies
select ggircs_portal_private.verify_policy('select', 'ciip_analyst_select_form_result_status', 'form_result_status', 'ciip_analyst');
select ggircs_portal_private.verify_policy('insert', 'ciip_analyst_insert_form_result_status', 'form_result_status', 'ciip_analyst');

-- ciip_industry_user Policies
select ggircs_portal_private.verify_policy('select', 'ciip_industry_user_select_form_result_status', 'form_result_status', 'ciip_industry_user');
select ggircs_portal_private.verify_policy('insert', 'ciip_industry_user_insert_form_result_status', 'form_result_status', 'ciip_industry_user');

-- ciip_guest Policies

rollback;
