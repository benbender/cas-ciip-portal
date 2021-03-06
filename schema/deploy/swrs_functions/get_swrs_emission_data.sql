-- Deploy ggircs-portal:function_get_swrs_emission_data to pg

begin;

  create type ggircs_portal.emission_data as (
    report_id integer ,
    quantity numeric,
    calculated_quantity numeric,
    emission_category varchar(1000),
    gas_type varchar(1000)
  );


  create or replace function ggircs_portal.get_swrs_emission_data(
    facility_id integer ,
    reporting_year integer
  )
  returns setof ggircs_portal.emission_data
  as
  $body$
    begin
      if exists (
        select 1
        from   information_schema.tables
        where  table_schema = 'swrs'
        and    table_name = 'emission'
      )
      then
      return query (
          with selected_report as (
            select * from swrs.report where swrs_facility_id = facility_id
            and reporting_period_duration = reporting_year
          )
          select
             report_id,
             sum(quantity) as quantity,
             sum(calculated_quantity) as calculated_quantity,
             emission_category,
             gas_type
             from swrs.emission as _emission
          inner join selected_report as _rep on _emission.report_id = _rep.id
          where emission_category is not null
          group by report_id, emission_category, gas_type
          order by emission_category
        );
      end if;
    end;
  $body$
  language 'plpgsql' stable;

  grant execute on function ggircs_portal.get_swrs_emission_data to ciip_administrator, ciip_analyst, ciip_industry_user;

commit;
