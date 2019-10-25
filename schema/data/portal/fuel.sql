begin;
insert into ggircs_portal.fuel(id, name, units, state) values
  (1, 'Acetylene','m3', 'active'),
  (2, 'Agricultural Byproducts','t', 'active'),
  (3,'Anthracite Coal','t', 'active'),
  (4,'Asphalt & Road Oil','kL', 'active'),
  (5,'Aviation Gasoline','kL', 'active'),
  (6,'Aviation Turbo Fuel','kL', 'active'),
  (7,'Biodiesel (100%)','kL', 'active'),
  (8,'Biogas (captured methane)','m3', 'active'),
  (9,'Bituminous Coal','t', 'active'),
  (10,'Bone char - organics','t', 'active'),
  (11,'Butane','kL', 'active'),
  (12,'Butylene','kL', 'active'),
  (13,'C/D Waste - Plastic','t', 'active'),
  (14,'C/D Waste - Wood','t', 'active'),
  (15,'Cloth','t', 'active'),
  (16,'CNCGs','m3', 'active'),
  (17,'Coal Coke','t', 'active'),
  (18,'Coal/PetCoke  blend','t', 'active'),
  (19,'Coke Oven Gas','m3', 'active'),
  (20,'Combustible Tall Oil','kL', 'active'),
  (21,'Crude Oil','kL', 'active'),
  (22,'Crude Sulfate Turpentine (CST)','kL', 'active'),
  (23,'Crude Tall Oil (CTO)','kL', 'active'),
  (24,'Diesel','kL', 'active'),
  (25,'Digester Gas','m3', 'active'),
  (26,'Distilate Fuel Oil No.1','kL', 'active'),
  (27,'Distilate Fuel Oil No.2','kL', 'active'),
  (28,'Distilate Fuel Oil No.4','kL', 'active'),
  (29,'DNCGs','m3', 'active'),
  (30,'Ethane','kL', 'active'),
  (31,'Ethanol (100%)','kL', 'active'),
  (32, 'Ethylene','kL', 'active'),
  (33,'E-Waste','t', 'active'),
  (34,'Explosives','t', 'active'),
  (35,'Field gas or process vent gas ','m3', 'active'),
  (36,'Field Gas','m3', 'active'),
  (37,'Foreign Bituminous Coal','t', 'active'),
  (38,'Isobutane','kL', 'active'),
  (39,'Isobutylene','kL', 'active'),
  (40,'Kerosene','kL', 'active'),
  (41,'Kerosene-type Jet Fuel','kL', 'active'),
  (42,'Landfill Gas','m3', 'active'),
  (43,'Light Fuel Oil','kL', 'active'),
  (44,'Lignite','t', 'active'),
  (45,'Liquified Petroleum Gases (LPG)','kL', 'active'),
  (46,'Lubricants','kL', 'active'),
  (47,'Motor Gasoline','kL', 'active'),
  (48,'Motor Gasoline - Off-Road','kL', 'active'),
  (49,'Municipal Solid Waste - biomass component','t', 'active'),
  (50,'Municipal Solid Waste - non-biomass component','t', 'active'),
  (51,'Naphtha','kL', 'active'),
  (52,'Natural Gasoline','kL', 'active'),
  (53,'Natural Gas','m3', 'active'),
  (54,'Nitrous Oxide','m3', 'active'),
  (55,'Peat','t', 'active'),
  (56,'PEF','t', 'active'),
  (57,'Petrochemical Feedstocks','kL', 'active'),
  (58,'Petroleum Coke','kL', 'active'),
  (59,'Petroleum Coke - Refinery Use','kL', 'active'),
  (60,'Plastic','t', 'active'),
  (61,'Propane','kL', 'active'),
  (62,'Propylene','kL', 'active'),
  (63,'Refinery Fuel Gas','m3', 'active'),
  (64,'Rendered Animal Fat','kL', 'active'),
  (65,'Residual Fuel Oil (#5 & 6)','kL', 'active'),
  (66,'RFG - Mix Drum','m3', 'active'),
  (67,'RFG - Reformer Gas','m3', 'active'),
  (68,'Roofing Tear-off','t', 'active'),
  (69,'SMR PSA Tail Gas','m3', 'active'),
  (70,'Sodium Bicarbonate','t', 'active'),
  (71,'Solid Byproducts','t', 'active'),
  (72,'Spent Pulping Liquor','t', 'active'),
  (73,'Still Gas - Refineries','m3', 'active'),
  (74,'Still Gas','m3', 'active'),
  (75,'Sub-Bituminous Coal','t', 'active'),
  (76,'Tail Gas','m3', 'active'),
  (77,'Tall Oil','kL', 'active'),
  (78,'Tires - biomass component','t', 'active'),
  (79,'Tires - non-biomass component','t', 'active'),
  (80,'Trona','t', 'active'),
  (81,'Turpentine','kL', 'active'),
  (82,'Vegetable Oil','kL', 'active'),
  (83,'Waste Oil','kL', 'active'),
  (84,'Wood Waste','t', 'active'),
  (85,'Flared Natural Gas CO2','m3', 'active'),
  (86,'Flared Natural Gas CH4','m3', 'active'),
  (87,'Flared Natural Gas N20','m3', 'active'),
  (88,'Vented Natural Gas','m3', 'active')
  on conflict(id) do update set units=excluded.units, state=excluded.state
  ;
commit;
