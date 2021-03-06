-- Deploy ggircs-portal:function_get_swrs_fuel_data to pg

begin;

create type ggircs_portal.fuel_data as (
  fuel_id integer,
  report_id integer,
  fuel_type varchar(1000),
  fuel_classification varchar(1000),
  fuel_description varchar(1000),
  fuel_units varchar(1000),
  annual_fuel_amount numeric,
  annual_weighted_avg_hhv numeric,
  annual_weighted_avg_carbon_content numeric,
  emission_category varchar(1000)
  );


create or replace function ggircs_portal.get_swrs_fuel_data(facility_id integer,
                                                            reporting_year integer)
  returns setof ggircs_portal.fuel_data
as
$body$
begin
  if exists(
    select 1
    from information_schema.tables
    where table_schema = 'swrs'
      and table_name = 'fuel'
    )
  then
    return query (
      with selected_report as (
        select *
        from swrs.report
        where swrs_facility_id = facility_id
          and reporting_period_duration = reporting_year
      )
      select
        distinct(_fuel.id),
        _fuel.report_id,
        regexp_replace(_details.normalized_fuel_type, '\s+\([^\)]+\)$', '')::varchar(1000) as fuel_type,
        fuel_classification,
        fuel_description,
        fuel_units,
        annual_fuel_amount,
        annual_weighted_avg_hhv,
        annual_weighted_avg_carbon_content,
        _emission.emission_category
      from swrs.fuel as _fuel
        inner join selected_report as _rep on _fuel.report_id = _rep.id
        inner join swrs.fuel_mapping _fuel_mapping on _fuel.fuel_mapping_id = _fuel_mapping.id
        inner join swrs.fuel_carbon_tax_details _details on _fuel_mapping.fuel_carbon_tax_details_id = _details.id
        left join swrs.unit _unit on _fuel.unit_id = _unit.id
        inner join swrs.activity _activity on _unit.activity_id = _activity.id
        inner join swrs.emission _emission on _activity.id = _emission.activity_id
      where _fuel.fuel_type is not null
    );
  end if;
end;
$body$
  language 'plpgsql' stable;

grant execute on function ggircs_portal.get_swrs_fuel_data to ciip_administrator, ciip_analyst, ciip_industry_user;

commit;
