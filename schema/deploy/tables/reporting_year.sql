-- Deploy ggircs-portal:table_reporting_year to pg
-- requires: schema_ggircs_portal

begin;

create table ggircs_portal.reporting_year (
    reporting_year integer not null primary key,
    reporting_period_start timestamp with time zone not null,
    reporting_period_end timestamp with time zone not null,
    application_open_date timestamp with time zone not null,
    application_end_date timestamp with time zone not null,
    application_response_date timestamp with time zone not null
);

comment on table ggircs_portal.reporting_year is 'Table containing the reporting year and important dates related to the application';
comment on column ggircs_portal.reporting_year.reporting_year is 'The current reporting year';
comment on column ggircs_portal.reporting_year.reporting_period_start is 'The date reporting period starts';
comment on column ggircs_portal.reporting_year.reporting_period_end is 'The date reporting period ends';
comment on column ggircs_portal.reporting_year.application_open_date is 'The date cipp applications open';
comment on column ggircs_portal.reporting_year.application_end_date is 'The date cipp applications close';
comment on column ggircs_portal.reporting_year.application_response_date is 'The date cipp users can expect a response by';

commit;