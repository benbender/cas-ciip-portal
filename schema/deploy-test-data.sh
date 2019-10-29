#!/bin/bash
set -e

dev_db=ggircs_dev

# =============================================================================
# Usage:
# -----------------------------------------------------------------------------
usage() {
    cat << EOF
$0 [-d] [-p] [-s] [-h]

Upserts test data in the $dev_db database, and deploys the schemas using sqitch if needed.
If run without the corresponding options, this script will deploy the swrs and portal schemas
if they do not exist, and then insert the portal test data.

Options

  -d, --drop-db
    Drops the $dev_db database before deploying
  -s, --deploy-swrs-schema
    Redeploys the swrs schema and inserts the swrs test reports. This requires the .cas-ggircs submodule to be initialized
  -p, --deploy-portal-schema
    Redeploys the portal schema
  -h, --help
    Prints this message

EOF
}

if [ "$#" -gt 3 ]; then
    echo "Passed $# parameters. Expected 0 to 3."
    usage
    exit 1
fi

__dirname="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
pushd "$__dirname" > /dev/null

_psql() {
  psql -d $dev_db -qtA --set ON_ERROR_STOP=1 "$@" 2>&1
}

dropdb() {
  echo "Drop the $dev_db database if it exists"
  psql -tc "SELECT 1 FROM pg_database WHERE datname = '$dev_db'" | grep -q 1 && psql -c "DROP DATABASE $dev_db";
}

createdb() {
  echo "Create the $dev_db database if it does not exist"
  psql -tc "SELECT 1 FROM pg_database WHERE datname = '$dev_db'" | grep -q 1 || psql -c "CREATE DATABASE $dev_db";
}

actions=()

sqitch_revert() {
  _psql -c "select 1 from pg_catalog.pg_namespace where nspname = 'sqitch'" | grep -q 1 && sqitch revert -y
  return 0
}

deploySwrs() {
  echo "Deploying the swrs schema to $dev_db"
  if [ ! -f .cas-ggircs/sqitch.plan ]; then
    echo "Could not find sqitch plan in $__dirname/.cas-ggircs."
    echo "Did you forgot to init and/or update the submodule?"
    exit 1
  fi
  pushd .cas-ggircs
  sqitch_revert
  sqitch deploy
  popd
  _psql <<EOF
  insert into
    swrs_extract.ghgr_import (id, xml_file)
    overriding system value
  values
  (1,'$(sed -e "s/'/''/g" < ./data/swrs/swrs_report_11033X.xml)')
  on conflict(id) do update set xml_file=excluded.xml_file;
EOF

  _psql -c "select swrs_transform.load()"
}

deploySwrsIfNotExists() {
  _psql -c "select 1 from pg_catalog.pg_namespace where nspname = 'swrs'" | grep -q 1 || deploySwrs
  return 0
}

deployPortal() {
  deploySwrsIfNotExists
  echo "Deploying the portal schema to $dev_db"
  sqitch_revert
  sqitch deploy
}

deployPortalIfNotExists() {
  _psql -c "select 1 from pg_catalog.pg_namespace where nspname = 'ggircs_portal'" | grep -q 1 || deployPortal
  return 0
}

while [[ "$1" =~ ^- && ! "$1" == "--" ]]; do case $1 in
  -d | --drop-db )
    actions+=('dropdb' 'deploySwrs' 'deployPortal')
    ;;
  -p | --deploy-portal-schema )
    actions+=('deployPortal')
    ;;
  -s | --deploy-swrs-schema )
    actions+=('deploySwrs')
    ;;
  -h | --help )
    usage
    exit 0
    ;;
esac; shift; done

[[ " ${actions[*]} " =~ " dropdb " ]] && dropdb
createdb
[[ " ${actions[*]} " =~ " deploySwrs " ]] && deploySwrs
[[ " ${actions[*]} " =~ " deployPortal " ]] && deployPortal
deployPortalIfNotExists

_psql <<EOF
begin;
with rows as (
insert into ggircs_portal.form_json
  (id, name, form_json)
  overriding system value
values
  (1, 'Admin', '$(cat "$__dirname/data/portal/form_json/administration.json")'::jsonb),
  (2, 'Emission', '$(cat "$__dirname/data/portal/form_json/emission.json")'::jsonb),
  (3, 'Fuel', '$(cat "$__dirname/data/portal/form_json/fuel.json")'::jsonb),
  (4, 'Electricity and Heat', '$(cat "$__dirname/data/portal/form_json/electricity_and_heat.json")'::jsonb),
  (5, 'Production', '$(cat "$__dirname/data/portal/form_json/production.json")'::jsonb),
  (6, 'Statement of Certification', '$(cat "$__dirname/data/portal/form_json/statement_of_certification.json")'::jsonb)
on conflict(id) do update
set name=excluded.name, form_json=excluded.form_json
returning 1
) select 'Inserted ' || count(*) || ' rows into ggircs_portal.form_json' from rows;

select setval from
setval('ggircs_portal.form_json_id_seq', (select max(id) from ggircs_portal.form_json), true)
where setval = 0;

commit;
EOF

_psql -f "$__dirname/data/portal/ciip_application_wizard.sql"
_psql -f "$__dirname/data/portal/fuel.sql"
_psql -f "$__dirname/data/portal/product.sql"
_psql -f "$__dirname/data/portal/user.sql"
_psql -f "$__dirname/data/portal/benchmark.sql"
_psql -f "$__dirname/data/portal/organisation.sql"
_psql -f "$__dirname/data/portal/facility.sql"
_psql -f "$__dirname/data/portal/application.sql"
_psql -f "$__dirname/data/portal/application_status.sql"
_psql -f "$__dirname/data/portal/form_result.sql"
