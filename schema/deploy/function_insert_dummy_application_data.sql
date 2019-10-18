-- Deploy ggircs-portal:function_insert_dummy_application_data to pg
-- requires: table_product
-- requires: table_benchmark
-- requires: table_form_result
-- requires: table_application_status

begin;

create or replace function ggircs_portal.insert_dummy_application_data()
  returns void
  as $function$

  insert into ggircs_portal.product(name, units, state) values ('Flaring, Venting, Fugitives, others', 'm3', 'active'), ('Sales Compression', 'm3', 'active'), ('Dehydration', 'kl', 'active'), ('Inlet Compression', 't', 'active');
  insert into ggircs_portal.benchmark(product_id, benchmark, eligibility_threshold, start_date) values (1, 600, 1500, '2019-09-17 14:49:54.191757-07'), (2, 200, 1000,'2019-09-17 14:49:54.191757-07'), (3, 1200, 5000,'2019-09-17 14:49:54.191757-07'), (4, 5000, 20000,'2019-09-17 14:49:54.191757-07');
  insert into ggircs_portal.application(id) values (1),(2),(3);
  insert into ggircs_portal.form_result(id, form_id, user_id, application_id, submission_date, form_result)
  values
  (1,3,2,1, '2019-09-17 14:49:54.191757-07', '{"fuels": [{"quantity": 60, "fuel_type": "combusted natural gas", "fuel_units": "m3", "description": "Nulla duis distincti", "methodology": "wci 2.0"}]}'),
  (2,6,2,1, '2019-09-17 14:49:54.191757-07', '{"certifiying_official": [{"fax": "+1 (827) 924-9225", "date": "1970-08-01", "phone": "+1 (248) 456-1467", "position": "Tempora ratione dolo", "last_name": "Dolore nulla unde te", "first_name": "Quasi voluptas atque", "email_address": "zyqowoc@mailinator.net", "certifier_name": "Voluptatibus dolor i", "mailing_address_city": "Beatae elit veritat", "mailing_address_line_1": "Numquam reiciendis s", "mailing_address_province": "New Brunswick", "mailing_address_postal_code": "h0h0h0"}]}'),
  (3,4,2,1, '2019-09-17 14:49:54.191757-07', '{"electricity_and_heat": [{"heat": [{"sold": 18, "quantity": 6, "description": 3, "consumed_onsite": 40, "generated_onsite": 72}], "electricity": [{"sold": 65, "quantity": 51, "description": 23, "consumed_onsite": 97, "generated_onsite": 2}]}]}'),
  (4,1,2,1, '2019-09-17 14:49:54.191757-07', '{"facility_information": [{"bcghgid": 12111130276, "latitude": 25, "longitude": 70, "naics_code": 89, "nearest_city": "Aperiam et explicabo", "facility_name": "Nisi facere laborios", "facility_type": "IF_B", "facility_description": "Nostrud et veniam s", "mailing_address_city": "In mollit reprehende", "mailing_address_line_1": "Reprehenderit exerci", "mailing_address_province": "British Columbia", "mailing_address_postal_code": "h0h0h0"}]}'),
  (5,1,2,1, '2019-09-17 14:49:54.191757-07', '{"reporting_operation_information": [{"naics_code": 20, "duns_number": 61, "operator_name": "Excepteur occaecat m", "operator_trade_name": "Voluptate qui labori", "mailing_address_city": "Nihil quibusdam prov", "mailing_address_line_1": "Labore ullam quo est", "mailing_address_country": "Consequuntur est et", "mailing_address_province": "British Columbia", "mailing_address_postal_code": "h0h0h0", "bc_corporate_registry_number": 52}]}'),
  (6,5,2,1, '2019-09-17 14:49:54.191757-07', '{"module_throughput_and_production_data": [{"units": "kl", "comments": "Aute consequatur Vo", "quantity": 4100, "processing_unit": "Dehydration", "associated_emissions": "Pariatur Magnam vel", "attributable_fuel_percentage": 89}]}'),
  (7,1,2,1, '2019-09-17 14:49:54.191757-07', '{"operational_representative_information": [{"fax": "+1 (303) 934-2116", "phone": "+1 (911) 413-8728", "position": "Amet et et assumend", "last_name": "Eius harum consequat", "first_name": "Et expedita accusant", "email_address": "fafolyfew@mailinator.net", "mailing_address_city": "Quidem et voluptates", "mailing_address_line_1": "Id officia commodi ", "mailing_address_province": "British Columbia", "mailing_address_postal_code": "h0h0h0"}]}'),

  (8,3,2,2, '2019-09-17 14:49:54.191757-07', '{"fuels": [{"quantity": 85, "fuel_type": "diesel", "fuel_units": "kl", "description": "Dolores fugit atque", "methodology": "wci 3.0"}]}'),
  (9,6,2,2, '2019-09-17 14:49:54.191757-07', '{"certifiying_official": [{"fax": "+1 (441) 781-8281", "date": "2011-02-18", "phone": "+1 (858) 434-2131", "position": "Veniam minima conse", "last_name": "Culpa duis quo qui e", "first_name": "Quis velit itaque el", "email_address": "kykup@mailinator.com", "certifier_name": "In voluptatem nisi ", "mailing_address_city": "Nisi nisi est doloru", "mailing_address_line_1": "Minim ut non expedit", "mailing_address_province": "British Columbia", "mailing_address_postal_code": "h0h0h0"}]}'),
  (10,4,2,2, '2019-09-17 14:49:54.191757-07', '{"electricity_and_heat": [{"heat": [{"sold": 32, "quantity": 93, "description": 26, "consumed_onsite": 7, "generated_onsite": 69}], "electricity": [{"sold": 28, "quantity": 71, "description": 8, "consumed_onsite": 9, "generated_onsite": 75}]}]}'),
  (11,1,2,2, '2019-09-17 14:49:54.191757-07', '{"facility_information": [{"bcghgid": 12111100001, "latitude": 62, "longitude": 7, "naics_code": 89, "nearest_city": "Delectus exercitati", "facility_name": "Dolor veniam dolore", "facility_type": "IF_B", "facility_description": "Provident ut praese", "mailing_address_city": "Explicabo Irure dol", "mailing_address_line_1": "Quasi aliquid incidu", "mailing_address_province": "British Columbia", "mailing_address_postal_code": "h0h0h0"}]}'),
  (12,1,2,2, '2019-09-17 14:49:54.191757-07', '{"reporting_operation_information": [{"naics_code": 92, "duns_number": 75, "operator_name": "Quo qui doloremque b", "operator_trade_name": "Sit dicta aut culpa", "mailing_address_city": "Aut eum laborum Ut ", "mailing_address_line_1": "Delectus obcaecati ", "mailing_address_country": "Minus dolores ration", "mailing_address_province": "British Columbia", "mailing_address_postal_code": "h0h0h0", "bc_corporate_registry_number": 28}]}'),
  (13,5,2,2, '2019-09-17 14:49:54.191757-07', '{"module_throughput_and_production_data": [{"units": ",m3", "comments": "Mollitia ex non temp", "quantity": 1100, "processing_unit": "Sales Compression", "associated_emissions": "Molestiae blanditiis", "attributable_fuel_percentage": 52}]}'),
  (14,1,2,2, '2019-09-17 14:49:54.191757-07', '{"operational_representative_information": [{"fax": "+1 (403) 112-7963", "phone": "+1 (475) 164-3308", "position": "Culpa officiis liber", "last_name": "Velit facilis offici", "first_name": "Facere nihil minima ", "email_address": "mojoqub@mailinator.com", "mailing_address_city": "Nesciunt et tenetur", "mailing_address_line_1": "Amet optio impedit", "mailing_address_province": "British Columbia", "mailing_address_postal_code": "h0h0h0"}]}');

  -- (4,1,2,3, '2019-08-04 02:23:54.191757-07', '{"fuels": [{"quantity": 32, "fuel_type": "diesel", "fuel_units": "kl", "description": "In culpa quisquam te", "methodology": "wci 2.0"}], "certifiying_official": [{"fax": "+1 (478) 721-6482", "date": "2006-01-08", "phone": "+1 (684) 305-6533", "position": "Ullam eum ut molliti", "last_name": "Accusantium in labor", "first_name": "Quam dolore quos ess", "email_address": "paqyfobep@mailinator.net", "certifier_name": "Quibusdam porro iust", "mailing_address_city": "Culpa dolor vero min", "mailing_address_line_1": "Qui aliquid quia vol", "mailing_address_province": "New Brunswick", "mailing_address_postal_code": "h0h0h0"}], "electricity_and_heat": [{"heat": [{"sold": 99, "quantity": 48, "description": 73, "consumed_onsite": 31, "generated_onsite": 80}], "electricity": [{"sold": 25, "quantity": 19, "description": 7, "consumed_onsite": 16, "generated_onsite": 72}]}], "facility_information": [{"bcghgid": 12111130277, "latitude": 56, "longitude": 20, "naics_code": 55, "nearest_city": "Ut voluptate officii", "facility_name": "Amet ut blanditiis ", "facility_type": "IF_A", "facility_description": "Modi voluptas sit q", "mailing_address_city": "Reiciendis aliquip i", "mailing_address_line_1": "Itaque maxime mollit", "mailing_address_province": "British Columbia", "mailing_address_postal_code": "h0h0h0"}], "reporting_operation_information": [{"naics_code": 7, "duns_number": 51, "operator_name": "Mollitia eum sint do", "operator_trade_name": "Voluptatem Sint eu", "mailing_address_city": "Officiis atque enim ", "mailing_address_line_1": "Incididunt sed ut ci", "mailing_address_country": "Dolores velit consec", "mailing_address_province": "British Columbia", "mailing_address_postal_code": "h0h0h0", "bc_corporate_registry_number": 80}], "module_throughput_and_production_data": [{"units": "t", "comments": "Similique dolores di", "quantity": 9200, "processing_unit": "Inlet Compression", "associated_emissions": "Dignissimos debitis ", "attributable_fuel_percentage": 47}], "operational_representative_information": [{"fax": "+1 (693) 646-4671", "phone": "+1 (623) 996-4603", "position": "Natus voluptatum eni", "last_name": "Nulla officia a cons", "first_name": "In quia iste et beat", "email_address": "lojivycudo@mailinator.net", "mailing_address_city": "Incididunt pariatur", "mailing_address_line_1": "Deserunt ad dolor pa", "mailing_address_province": "British Columbia", "mailing_address_postal_code": "h0h0h0"}]}');
  insert into ggircs_portal.application_status(id, application_id, application_status, form_result_id) values (1,1, 'pending', 2), (2,2, 'pending', 3), (3,3, 'pending', 4);

  $function$
  language sql;

select ggircs_portal.insert_dummy_application_data();
commit;
