set client_min_messages to warning;
create extension if not exists pgtap;
reset client_min_messages;

begin;
select plan(9);

create table ggircs_portal.test_table
(
  id integer primary key generated always as identity
);

create table ggircs_portal.test_table_specific_column_grants
(
  id integer primary key generated always as identity,
  allowed text,
  denied text
);

select has_function(
  'ggircs_portal', 'grant_permissions',
  'Function grant_permissions should exist'
);

select throws_ok(
  $$
    select ggircs_portal.grant_permissions('badoperation', null, 'test_table', 'ciip_administrator');
  $$,
  'P0001',
  'invalid operation variable. Must be one of [select, insert, update, delete]',
  'Function grant_permissions throws an exception if the operation variable is not in (select, insert, update, delete)'
);

select lives_ok(
  $$
    select ggircs_portal.grant_permissions('select', null, 'test_table', 'ciip_administrator');
  $$,
  'Function grants select'
);

select lives_ok(
  $$
    select ggircs_portal.grant_permissions('insert', null, 'test_table', 'ciip_administrator');
  $$,
  'Function grants insert'
);

select lives_ok(
  $$
    select ggircs_portal.grant_permissions('update', null, 'test_table', 'ciip_administrator');
  $$,
  'Function grants update'
);

select lives_ok(
  $$
    select ggircs_portal.grant_permissions('delete', null, 'test_table', 'ciip_administrator');
  $$,
  'Function grants delete'
);

select table_privs_are (
  'ggircs_portal',
  'test_table',
  'ciip_administrator',
  ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE'],
  'role ciip_administrator has been granted select, insert, update, delete on ggircs_portal.test_table'
);

select lives_ok(
  $$
    select ggircs_portal.grant_permissions('select', ARRAY['allowed'], 'test_table_specific_column_grants', 'ciip_administrator');
  $$,
  'Function grants select when specific columns are specified'
);

select column_privs_are (
  'ggircs_portal',
  'test_table_specific_column_grants',
  'allowed',
  'ciip_administrator',
  ARRAY['SELECT'],
  'ciip_administrator has privilege SELECT only on column `allowed` in test_table_specific_column_grants'
);

select finish();
rollback;
