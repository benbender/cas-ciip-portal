-- Revert ggircs-portal:function_create_application_mutation_chain from pg

begin;

drop function ggircs_portal.create_application_mutation_chain;

commit;
