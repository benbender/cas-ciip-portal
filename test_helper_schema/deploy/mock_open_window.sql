-- Deploy test_helpers:mock_open_window to pg
-- requires: schema_test_helper

begin;

create or replace function test_helper.mock_open_window()
returns void as
$function$

  create or replace function ggircs_portal.open_window() returns timestamptz as
  $$
    select application_open_time
    from ggircs_portal.reporting_year
    where reporting_year = 2019
  $$ language sql;

  insert into ggircs_portal.reporting_year(reporting_year, reporting_period_start, reporting_period_end, swrs_deadline, application_open_time, application_close_time)
  overriding system value
  values(
    (select date_part('year', now()- interval '1 year')::int),
    (select concat((select date_part('year', now()- interval '1 year')::text), '-01-01 00:00:00.0-08')::timestamptz),
    (select concat((select date_part('year', now()- interval '1 year')::text), '-12-31 23:59:59.0-08')::timestamptz),
    (select concat((select date_part('year', now())::text), '-07-31 00:00:00.000000-07')::timestamptz),
    (select now() - interval '1 day'),
    (select now() + interval '1 day')
  );

$function$ language sql;

commit;