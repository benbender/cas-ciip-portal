-- Deploy ggircs-portal:table_reporting_year to pg
-- requires: schema_ggircs_portal

begin;

create table ggircs_portal.reporting_year (
    reporting_year integer not null primary key,
    reporting_period_start timestamp with time zone not null,
    reporting_period_end timestamp with time zone not null,
    swrs_deadline timestamp with time zone not null,
    application_open_time timestamp with time zone not null,
    application_close_time timestamp with time zone not null
);

do
$grant$
begin
-- Grant ciip_administrator permissions
perform ggircs_portal_private.grant_permissions('select', 'reporting_year', 'ciip_administrator');
perform ggircs_portal_private.grant_permissions('insert', 'reporting_year', 'ciip_administrator');
perform ggircs_portal_private.grant_permissions('update', 'reporting_year', 'ciip_administrator');

-- Grant ciip_analyst permissions
perform ggircs_portal_private.grant_permissions('select', 'reporting_year', 'ciip_analyst');

-- Grant ciip_industry_user permissions
perform ggircs_portal_private.grant_permissions('select', 'reporting_year', 'ciip_industry_user');

-- Grant ciip_guest permissions
perform ggircs_portal_private.grant_permissions('select', 'reporting_year', 'ciip_guest');

end
$grant$;

-- Enable row-level security
alter table ggircs_portal.reporting_year enable row level security;

comment on table ggircs_portal.reporting_year is 'Table containing the reporting year and important dates related to the application';
comment on column ggircs_portal.reporting_year.reporting_year is 'The current reporting year';
comment on column ggircs_portal.reporting_year.reporting_period_start is 'The date and time reporting period starts';
comment on column ggircs_portal.reporting_year.reporting_period_end is 'The date and time reporting period ends';
comment on column ggircs_portal.reporting_year.swrs_deadline is 'The Industrial GHG (SWRS) Reporting deadline';
comment on column ggircs_portal.reporting_year.application_open_time is 'The date and time the CIIP applications open';
comment on column ggircs_portal.reporting_year.application_close_time is 'The date and time the CIIP applications close';

commit;
