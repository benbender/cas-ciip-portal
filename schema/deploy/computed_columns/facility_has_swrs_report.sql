-- Deploy ggircs-portal:function_facility_has_swrs_report to pg
-- requires: table_facility

begin;

drop function if exists ggircs_portal.facility_has_swrs_report;

create or replace function ggircs_portal.facility_has_swrs_report(facility ggircs_portal.facility)
  returns boolean
as
$function$
declare
  current_year int;
begin
  current_year = (select reporting_year from ggircs_portal.opened_reporting_year());
  return (select count(*) from swrs.report where swrs_facility_id = facility.swrs_facility_id and reporting_period_duration = current_year);
end;

$function$
  language 'plpgsql' stable;

grant execute on function ggircs_portal.facility_has_swrs_report to ciip_administrator, ciip_analyst, ciip_industry_user;

commit;
