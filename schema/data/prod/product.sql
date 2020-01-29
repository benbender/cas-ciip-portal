begin;

with rows as (
insert into ggircs_portal.product(id, name, units, state, product_form_id)
overriding system value
values
(1,'Aluminum Smelting','tonnes of aluminum produced','active', 5),
(2, 'Cannabis (flowers and seedlings) grown under cover', 'hectares of growing space', 'active', null),
(3, 'Cement equivalent', 'tonnes of cement equivalent','active', 6),
(4, 'Centrifugal Compression ','MWh','active',1),
(5, 'Chemical Pulp', 'bone-dry tonnes','active', null),
(6, 'Copper equivalent (open pit)','tonnes of Copper equivalent','active',null),
(7, 'Copper equivalent (underground)','tonnes of Copper equivalent','active',null),
(8, 'Food (including seedlings) grown under cover', 'hectares of growing space', 'active', null),
(9, 'District energy (heat)', 'MWh','active', null),
(10, 'Exported electricity', 'MWh', 'active', null),
(11, 'Exported heat', 'GJ', 'active', null),
(12, 'Gold equivalent','tonnes of gold equivalent','active',null),
(13, 'Forged steel balls (grinding media <3.5")','tonnes','active',null),
(14, 'Forged steel balls (grinding media >4")','tonnes','active',null),
(15, 'Gypsum wallboard','square meters','active', null),
(16, 'Lime', 'Tonnes','active', null),
(17, 'Hot dip galvanizing','tonnes of wire processed','active',null),
(18, 'Hydrogen Peroxide (H2O2)', 'tonnes of pure (100%) Hydrogen Peroxide produced','active', null),
(19, 'Lead-Zinc Smelting','tonnes of lead and zinc','active',null),
(20, 'Sweet Gas Plants','e3m3OE','active',4),
(21, 'Sour Gas Plants','e3m3OE','active',3),
(22, 'Sugar (liquid)', 'tonnes','active', null),
(23, 'Sugar (solid)', 'tonnes','active', null),
(24, 'Liquefied Natural Gas (LNG)', 'tonnes', 'active', null),
(25, 'Lumber', 'cubic meters', 'active', null),
(26, 'Coal','tonnes','active',null),
(27, 'Veneer', 'cubic meters', 'active', null),
(28, 'Wood Panels (Plywood, MDF, OSB)', 'cubic meters','active', null),
(29, 'Other Pulp (Mechanical pulp, paper, newsprint)', 'Bone-dry tonnes','active', null),
(30, 'Wire draw production','tonnes of wire processed','active',null),
(31, 'Reciprocating Compression ','MWh','active',2),
(32, 'Silver Equivalent','Tonnes of Silver equivalent','active',null),
(33, 'Petroleum Refining','BC refining complexity factor unit','active',null),
(34, 'Wood pellets', 'bone dry tonnes','active', null),
(35, 'Wood chips', 'bone dry tonnes','active', null),
(36, 'Waste rendering', 'tonnes','active', null)
on conflict(id) do update
set
name=excluded.name,
units=excluded.units,
state=excluded.state,
product_form_id=excluded.product_form_id
returning 1
) select 'Inserted ' || count(*) || ' rows into ggircs_portal.product' from rows;

select setval from
setval('ggircs_portal.product_id_seq', (select max(id) from ggircs_portal.product), true)
where setval = 0;

commit;
