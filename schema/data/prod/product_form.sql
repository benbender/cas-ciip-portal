begin;

create temporary table centrifugal_compression(json_data jsonb);
\copy centrifugal_compression(json_data) from program 'sed ''s/\\/\\\\/g'' < prod/product_form/centrifugal_compression.json | tr -d ''\n''';

create temporary table reciprocating_compression(json_data jsonb);
\copy reciprocating_compression(json_data) from program 'sed ''s/\\/\\\\/g'' < prod/product_form/reciprocating_compression.json | tr -d ''\n''';

create temporary table sour_gas_plant(json_data jsonb);
\copy sour_gas_plant(json_data) from program 'sed ''s/\\/\\\\/g'' < prod/product_form/sour_gas_plant.json | tr -d ''\n''';

create temporary table sweet_gas_plant(json_data jsonb);
\copy sweet_gas_plant(json_data) from program 'sed ''s/\\/\\\\/g'' < prod/product_form/sweet_gas_plant.json | tr -d ''\n''';

create temporary table aluminum_smelting(json_data jsonb);
\copy aluminum_smelting(json_data) from program 'sed ''s/\\/\\\\/g'' < prod/product_form/aluminum_smelting.json | tr -d ''\n''';

create temporary table cement_equivalent(json_data jsonb);
\copy cement_equivalent(json_data) from program 'sed ''s/\\/\\\\/g'' < prod/product_form/cement_equivalent.json | tr -d ''\n''';

with rows as (
insert into ggircs_portal.product_form(id, product_form_description, product_form_schema)
overriding system value
values
(1, 'Product form for Centrifugal Compression', (select json_data from centrifugal_compression)),
(2, 'Product form for Reciprocating Compression', (select json_data from reciprocating_compression)),
(3, 'Product form for Sour Gas Plants', (select json_data from sour_gas_plant)),
(4, 'Product form for Sweet Gas Plants', (select json_data from sweet_gas_plant)),
(5, 'Product form for Aluminum Smelting', (select json_data from aluminum_smelting)),
(6, 'Product form for Cement Equivalent', (select json_data from cement_equivalent))


on conflict(id) do update
set
product_form_description=excluded.product_form_description,
product_form_schema=excluded.product_form_schema
returning 1
) select 'Inserted ' || count(*) || ' rows into ggircs_portal.product_form' from rows;

select setval from
setval('ggircs_portal.product_form_id_seq', (select max(id) from ggircs_portal.product_form), true)
where setval = 0;

commit;
