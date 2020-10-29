-- Deploy mocks:mock_now_method to pg
-- requires: schema_mocks

BEGIN;


  create or replace function mocks.now()
  returns timestamptz as
  $function$
    declare
      returnValue timestamptz;
    begin
      -- look at the database options if there is a value set
      -- if it's not set the current_setting method returns nil and we coalesce to 'false'
      returnValue := coalesce(
          current_setting('mocks.mocked_timestamp', true),
          pg_catalog.now()::text
      )::timestamptz;
      return returnValue;
    exception
      -- In case of a parsing error or anything else, we return the regular now() behaviour
      when others then
        raise notice 'mocks.now() encountered an error and defaulted back to the regular behaviour'
        return pg_catalog.now();
    end;
  $function$ language plpgsql volatile;

COMMIT;
