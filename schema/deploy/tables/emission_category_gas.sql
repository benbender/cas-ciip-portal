-- Deploy ggircs-portal:table_emission_category_gas to pg
-- requires: schema_ggircs_portal

begin;

create table ggircs_portal.emission_category_gas (
  id integer primary key generated always as identity,
  emission_category_id integer references ggircs_portal.emission_category(id),
  emission_category_description varchar(10000),
  gas_id integer references ggircs_portal.gas(id),
  created_at timestamp with time zone not null default now(),
  created_by int references ggircs_portal.ciip_user,
  updated_at timestamp with time zone not null default now(),
  updated_by int references ggircs_portal.ciip_user,
  deleted_at timestamp with time zone,
  deleted_by int references ggircs_portal.ciip_user
);

create trigger _100_timestamps
  before insert or update on ggircs_portal.emission_category_gas
  for each row
  execute procedure ggircs_portal_private.update_timestamps();

do
$grant$
begin
-- Grant ciip_administrator permissions
perform ggircs_portal_private.grant_permissions('select', 'emission_category_gas', 'ciip_administrator');
perform ggircs_portal_private.grant_permissions('insert', 'emission_category_gas', 'ciip_administrator');
perform ggircs_portal_private.grant_permissions('update', 'emission_category_gas', 'ciip_administrator');

-- Grant ciip_analyst permissions
perform ggircs_portal_private.grant_permissions('select', 'emission_category_gas', 'ciip_analyst');

-- Grant ciip_industry_user permissions
perform ggircs_portal_private.grant_permissions('select', 'emission_category_gas', 'ciip_industry_user');

-- Grant ciip_guest permissions
-- ?
end
$grant$;

-- Enable row-level security
alter table ggircs_portal.emission_category_gas enable row level security;

comment on table ggircs_portal.emission_category_gas is 'Table of emission categories used in the CIIP program';
comment on column ggircs_portal.emission_category_gas.id is 'Unique ID for the emission_category_gas';
comment on column ggircs_portal.emission_category_gas.gas_id is 'Foreign key to gas';
comment on column ggircs_portal.emission_category_gas.emission_category_id is 'Foreign key to emission_category';
comment on column ggircs_portal.emission_category_gas.emission_category_description is 'The description of the emission category';
comment on column ggircs_portal.emission_category_gas.created_at is 'Creation date of row';
comment on column ggircs_portal.emission_category_gas.created_by is 'Creator of row';
comment on column ggircs_portal.emission_category_gas.updated_at is 'Updated date of row';
comment on column ggircs_portal.emission_category_gas.updated_by is 'Updator of row';
comment on column ggircs_portal.emission_category_gas.deleted_at is 'Date of deletion';
comment on column ggircs_portal.emission_category_gas.deleted_by is 'The user who deleted the row';

commit;
