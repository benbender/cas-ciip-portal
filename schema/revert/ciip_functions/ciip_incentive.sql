-- Revert ggircs-portal:ciip_functions/ciip_incentive from pg

begin;

drop function ggircs_portal.ciip_incentive;

commit;
