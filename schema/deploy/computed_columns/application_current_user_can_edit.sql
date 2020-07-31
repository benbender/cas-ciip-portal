-- Deploy ggircs-portal:computed_columns/application_current_user_can_edit to pg
-- requires: tables/ciip_user_organisation
-- requires: tables/application

begin;

  create or replace function ggircs_portal.application_current_user_can_edit(
    app ggircs_portal.application
  )
  returns boolean
  as
  $body$
    declare
      return_value boolean;
      current_user_id = (select id from ggircs_portal.ciip_user where uuid=(select sub from ggircs_portal.session));
      org_id = (select organisation_id from app join ggircs_portal.facility f on app.facility_id = f.id);
    begin
      return (select exists(select * from ggircs_portal.ciip_user_organisation where user_id=current_user_id and organisation_id=org_id and status='approved'));
    end;
  $body$
  language 'plpgsql' stable;

  grant execute on function ggircs_portal.application_current_user_can_edit to ciip_administrator, ciip_analyst, ciip_industry_user;

  comment on function ggircs_portal.application_current_user_can_edit is 'returns a boolean value based on whether the current user has edit permission on the application';

commit;
