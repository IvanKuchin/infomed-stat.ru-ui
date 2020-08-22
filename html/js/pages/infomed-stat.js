/*jslint devel: true, indent: 4, maxerr: 50, esversion: 6*/
/*globals $:false localStorage:false location: false*/
/*globals localStorage:false*/
/*globals location:false*/
/*globals document:false*/
/*globals window:false*/
/*globals Image:false*/
/*globals jQuery:false*/
/*globals Notification:false*/
/*globals setTimeout:false*/
/*globals navigator:false*/
/*globals module:false*/
/*globals define:false*/

infomed_stat = (function()
{
	var	dictionary = [];
		dictionary.adjuvant_chemotherapy_conduct	= "адъювантная полихимиотерапия";
		dictionary.another_option					= "свой вариант";
		dictionary.another_organ_resect				= "резекция других органов";
		dictionary.back								= "задняя";
		dictionary.bilirubin_level_at_operation		= "уровень билирубина на момент операции";
		dictionary.birthdate						= "дата рождения";
		dictionary.bud								= "почка";
		dictionary.ca_level_19						= "уровень са 19.9";
		dictionary.cancer_size						= "размер опухоли";
		dictionary.cancer_type						= "тип опухоли";
		dictionary.celiac_trunk						= "чревный ствол";
		dictionary.clavien_dindo_complications		= "класс осложнений по clavien-dindo";
		dictionary.colon							= "толстая кишка";
		dictionary.comment							= "коментарий";
		dictionary.common_hepatic_art				= "общая печеночная артерия";
		dictionary.complications					= "осложнения";
		dictionary.damage_to_lymph_nodes			= "поражение лимфатических узлов";
		dictionary.death_date						= "дата смерти";
		dictionary.differentiation_level			= "степень дифференциации";
		dictionary.distant_metastases				= "отдаленные метастазы";
		dictionary.drainage							= "дренирование";
		dictionary.drainage_options					= "варианты дренирования";
		dictionary.envasion_extent					= "протяженность инвазии";
		dictionary.first_name						= "имя";
		dictionary.front							= "передняя";
		dictionary.invasion_date					= "дата операции";
		dictionary.invasion_level					= "глубина инвазии";
		dictionary.last_name						= "фамилия";
		dictionary.lesion_volume					= "объем поражения";
		dictionary.liver							= "печень";
		dictionary.locality							= "город";
		dictionary.lungs							= "легкие";
		dictionary.lymph_node_damage				= "пораженные лимф. узлы";
		dictionary.medial							= "медмальный";
		dictionary.medical_history_number			= "история болезни";
		dictionary.middle_name						= "отчество";
		dictionary.neoadj_chemo						= "неоадъювантная полихимиотерапия";
		dictionary.number_lymph_node_damage			= "количество пораженных лимф. узлов";
		dictionary.op_done							= "проведение операции";
		dictionary.operation_class					= "объем операции";
		dictionary.operation_type					= "вид операции";
		dictionary.other							= "свой вариант";
		dictionary.pancreatic_fistula				= "панкреатическая фистула";
		dictionary.peritoneum						= "брюшина";
		dictionary.phone							= "телефон";
		dictionary.portal_vein						= "воротная вена";
		dictionary.preneural_invasion				= "периневральная инвазия";
		dictionary.region							= "область";
		dictionary.relapse_biochemical				= "биохимический рецидив";
		dictionary.relapse_date						= "дата рецидива";
		dictionary.relapse_local					= "местный рецидив";
		dictionary.relapse_metastases				= "метастазы";
		dictionary.resect_edge_type_r1				= "границы резекции r1";
		dictionary.resect_extent					= "протяженность резекции";
		dictionary.resect_type						= "вмд резекции";
		dictionary.resectability					= "резектабельность";
		dictionary.roughness_contour				= "неровность контура";
		dictionary.scheme_name						= "название схемы";
		dictionary.scheme_quantity					= "количество курсов";
		dictionary.separate_metastases				= "наличие отдаленных метастазов";
		dictionary.study_retirment_date				= "дата выбытия из исследования";
		dictionary.sup_mesent_artery				= "верхнебрыжеечная артерия";
		dictionary.sup_mesent_vein					= "верхнебрыжеечная вена";
		dictionary.thrombosis						= "тромбоз";
		dictionary.top								= "верхняя";
		dictionary.top_branches						= "ветви верхней брыжеечной вены";
		dictionary.vasc_resect						= "резекция сосудов";
		dictionary.vascular_growing					= "рост в сосуд";
		dictionary.vascular_type_artery				= "артерия";
		dictionary.vascular_type_vein				= "вена";
		dictionary.venous_confluence				= "венозный конфлюенс";
		dictionary.zip_code							= "индекс";

	var	GetRussianSpelling = function(eng_name)
	{
		return dictionary[eng_name];
	};

	var	GetMedicalItemNameSpelling = function(med_item)
	{
		let result = "";

		med_item.split(/___/).forEach(function(item)
		{
			if(item.length)
			{
				if(result.length) result += " -> ";

				result += GetRussianSpelling(item);
			}
		});

		return result;
	};

	var	GetMedicalItemValueSpelling = function(value)
	{
		let result = value;

		if(value == "Y") result = "да";

		return result;
	};


	return {
		GetRussianSpelling: GetRussianSpelling,
		GetMedicalItemNameSpelling: GetMedicalItemNameSpelling,
		GetMedicalItemValueSpelling: GetMedicalItemValueSpelling,
	};

})();

