set client_min_messages to warning;
create extension if not exists pgtap;
reset client_min_messages;

begin;


select plan(4);

select has_function(
  'ggircs_portal', 'opened_reporting_year',
  'Function opened_reporting_year should exist'
);

-- 2020 open date
select mocks.set_mocked_time_in_transaction('2021-04-01 14:49:54.191757-07'::timestamptz);

select results_eq(
  'select * from ggircs_portal.opened_reporting_year()',
  'select * from ggircs_portal.reporting_year order by reporting_year limit 1 offset 2',
  'The opened_reporting_year function returns the correct reporting year if the window is opened'
);


-- 2020 open date minus one second
select mocks.set_mocked_time_in_transaction('2021-04-01 14:49:54.191757-07'::timestamptz - interval '1 second');

select is(
  (select reporting_year from ggircs_portal.opened_reporting_year()), null,
  'The opened_reporting_year function returns a null reporting year if the application is not opened yet'
);


-- 2020 close date plus one second
select mocks.set_mocked_time_in_transaction('2021-12-30 14:49:54.191757-08'::timestamptz + interval '1 second');

select is(
  (select reporting_year from ggircs_portal.opened_reporting_year()), null,
  'The opened_reporting_year function returns a null reporting year if the application is not opened anymore'
);

select finish();

rollback;
