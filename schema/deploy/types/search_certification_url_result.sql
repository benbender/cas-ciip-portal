-- Deploy ggircs-portal:types/search_certification_url_result to pg
-- requires: schema_ggircs_portal

begin;

create type ggircs_portal.search_certification_url_result as (
    id bigint,
    certification_url_id varchar(1000),
    application_id integer,
    version_number integer,
    certified_at timestamptz,
    certifier_email varchar(1000),
    facility_name varchar(1000),
    operator_name varchar(1000),
    application_revision_status ggircs_portal.ciip_application_revision_status,
    certified_by_first_name varchar(1000),
    certified_by_last_name varchar(1000),
    total_request_count int
);

comment on type ggircs_portal.search_certification_url_result is '@primaryKey (id)
@foreignKey (application_id) references ggircs_portal.application(id)
@foreignKey (certification_url_id) references ggircs_portal.certification_url(id)';
commit;
