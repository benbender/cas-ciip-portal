-- Verify ggircs-portal:function_ciip_user_certification_requests on pg

BEGIN;

select pg_get_functiondef('ggircs_portal.ciip_user_has_certification_requests(ggircs_portal.ciip_user)'::regprocedure);

ROLLBACK;
