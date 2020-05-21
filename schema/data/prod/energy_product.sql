begin;

alter table ggircs_portal.product disable trigger _protect_read_only_products;

with rows as (
insert into ggircs_portal.product(id, product_name, units, product_state, requires_emission_allocation, requires_product_amount, is_read_only)
overriding system value
values
(1, 'Exported electricity', 'MWh', 'published' ,true, true, true),
(2, 'Exported heat', 'GJ', 'published' ,true, true, true),
(3, 'Purchased electricity', 'GWh', 'published' ,true, true, true),
(4, 'Purchased heat', 'GJ', 'published' ,true, true, true),
(5, 'Generated electricity', 'GWh', 'published' ,true, true, true),
(6, 'Generated heat', 'GJ', 'published' ,true, true, true),
(7, 'Emissions from EIOs', 'GJ', 'published' ,true, true, true)
on conflict(id) do update
set
product_name=excluded.product_name,
units=excluded.units,
product_state=excluded.product_state,
requires_emission_allocation=excluded.requires_emission_allocation,
requires_product_amount=excluded.requires_product_amount,
is_read_only=excluded.is_read_only
returning 1
) select 'Inserted ' || count(*) || ' rows into ggircs_portal.product' from rows;

select setval from
setval('ggircs_portal.product_id_seq', (select max(id) from ggircs_portal.product), true)
where setval = 0;

alter table ggircs_portal.product enable trigger _protect_read_only_products;

commit;