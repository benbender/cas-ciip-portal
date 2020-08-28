begin;

-- Re-populate products table, which was truncated in test setup:
\i ../schema/data/dev/product.sql

delete from ggircs_portal.certification_url where application_id=1;

alter table ggircs_portal.ciip_user_organisation
  enable trigger _set_user_id;
alter table ggircs_portal.certification_url
  enable trigger _random_id;
alter table ggircs_portal.application_revision_status
  enable trigger _status_change_email;
alter table ggircs_portal.certification_url
  enable trigger _certification_request_email;
alter table ggircs_portal.certification_url
  enable trigger _signed_by_certifier_email;
alter table ggircs_portal.ciip_user_organisation
  enable trigger _send_request_for_access_email;
alter table ggircs_portal.ciip_user_organisation
  enable trigger _send_access_approved_email;
alter table ggircs_portal.application
  enable trigger _send_draft_application_email;
alter table ggircs_portal.certification_url
  enable trigger _100_timestamps;

commit;
