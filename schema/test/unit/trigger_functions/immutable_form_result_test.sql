set client_min_messages to warning;
create extension if not exists pgtap;
reset client_min_messages;

begin;
select plan(3);

select has_function(
  'ggircs_portal_private', 'immutable_form_result',
  'Function immutable_form_result should exist'
);

select throws_like(
  $$
    update ggircs_portal.form_result
    set form_result='{"operator":{"name": "updated"}}'
    where application_id=1 and version_number=1 and form_id=1;
  $$,
  'Form_result is immutable%',
  'Throws when attempting to update a form result from a submitted application'
);


select test_helper.modify_triggers('disable', '{"application_revision_status":["_read_only_status_for_non_current_version", "_status_change_email"]}');
-- Set application status to draft
insert into ggircs_portal.application_revision_status(application_id, version_number, application_revision_status)
values (1,1,'draft');

select lives_ok(
  $$
    update ggircs_portal.form_result
    set form_result='{"operator":{"name": "start"}}'
    where application_id=1 and version_number=1 and form_id=1;
  $$,
  'Does not throw when application has not been submitted'
);

select finish();

rollback;
