-- Revert ggircs-portal:computed_columns/application_revision_certification_url from pg

begin;

drop function ggircs_portal.application_revision_certification_url;

commit;
