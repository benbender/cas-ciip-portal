-- Verify ggircs-portal:policies/fuel_policies on pg

begin;

-- ciip_administrator Policies
select ggircs_portal_private.verify_policy('select', 'ciip_administrator_select_fuel', 'fuel', 'ciip_administrator');
select ggircs_portal_private.verify_policy('insert', 'ciip_administrator_insert_fuel', 'fuel', 'ciip_administrator');
select ggircs_portal_private.verify_policy('update', 'ciip_administrator_update_fuel', 'fuel', 'ciip_administrator');

-- ciip_analyst Policies
select ggircs_portal_private.verify_policy('select', 'ciip_analyst_select_fuel', 'fuel', 'ciip_analyst');

-- ciip_industry_user Policies
select ggircs_portal_private.verify_policy('select', 'ciip_industry_user_select_fuel', 'fuel', 'ciip_industry_user');

rollback;
