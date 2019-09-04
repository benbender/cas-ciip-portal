-- Deploy ggircs-portal:table_application to pg
-- requires: schema_ggircs_portal
-- requires: table_form_result

BEGIN;

create table ggircs_portal.application as (
    with x as (
      select
        cast(id as text) as id,
        json_array_elements((form_result -> 'facility_information')::json) as facility_data,
        json_array_elements((form_result -> 'reporting_operation_information')::json) as operator_data,
        submission_date
      from ggircs_portal.form_result
    )
    select
       x.id as application_id,
       x.facility_data ->> 'facility_name' as facility_name,
       x.operator_data ->> 'operator_name' as operator_name,
       x.facility_data ->> 'bcghgid' as bcghgid,
       '2018' as reporting_year
       x.submission_date as submission_date
       
    from x
 );

 alter table ggircs_portal.application
    add column application_status varchar(1000) default 'pending';

comment on table ggircs_portal.application is 'The application data';
comment on column ggircs_portal.application.application_id is 'The application id used for reference and join';
comment on column ggircs_portal.application.facility_name is 'The facility related to the application';
comment on column ggircs_portal.application.operator_name is 'The operator related to the application';
comment on column ggircs_portal.application.submission_date is 'The submission date of the application';
comment on column ggircs_portal.application.application_status is 'The application status';

COMMIT;
