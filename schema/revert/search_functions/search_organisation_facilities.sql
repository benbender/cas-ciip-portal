-- Revert ggircs-portal:function_search_organisation_facilities from pg

begin;

drop function ggircs_portal.search_organisation_facilities;

commit;
