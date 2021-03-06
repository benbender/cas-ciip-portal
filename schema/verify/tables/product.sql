-- Verify ggircs-portal:product on pg

begin;

select pg_catalog.has_table_privilege('ggircs_portal.product', 'select');

-- ciip_administrator Grants
select ggircs_portal_private.verify_grant('select', 'product', 'ciip_administrator');
select ggircs_portal_private.verify_grant('insert', 'product', 'ciip_administrator');
select ggircs_portal_private.verify_grant('update', 'product', 'ciip_administrator');

-- ciip_analyst Grants
select ggircs_portal_private.verify_grant('select', 'product', 'ciip_analyst');

-- ciip_industry_user Grants
select ggircs_portal_private.verify_grant('select', 'product', 'ciip_industry_user');

rollback;
