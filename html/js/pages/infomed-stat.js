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
		dictionary.second_line						= "2-я линия";
		dictionary.third_line						= "3-я линия";
		dictionary.adverse_event					= "adverse event";
		dictionary.brachi_therapy					= "Проведение брахитерапии";
		dictionary.brca								= "BRCA";
		dictionary.brca_localization_breast			= "Рак молочной железы";
		dictionary.brca_localization_ovaries		= "Рак яичников";
		dictionary.chemo_therapy					= "химиотерапия";
		dictionary.ct_post_adj_therapy				= "КТ после адъювантной терапии";
		dictionary.finish_date						= "окончание";
		dictionary.idworak							= "iDWORAK";
		dictionary.loko_therapy						= "Проведение локорегионарной терапии";
		dictionary.pre_op							= "дооперационное";
		dictionary.pre_op_ct						= "дооперационное КТ";
		dictionary.pre_op_lab_chromo				= "Уровень Хромогранин А";
		dictionary.pre_op_lab_nse					= "Уровень NSE";
		dictionary.pre_op_lab_rea					= "Уровень РЭА";
		dictionary.pre_op_lab_serot					= "Уровень Серотонина";
		dictionary.pre_op_petct						= "дооперационное ПЭТ КТ";
		dictionary.ray_therapy						= "лучевая терапия";
		dictionary.recist							= "RECIST";
		dictionary.start_date						= "начало";
		dictionary.syrgical_treatment				= "хирургмческое лечение";
		dictionary.xray_therapy						= "лучеаая терапия";
		dictionary.adjuvant_chemotherapy_conduct	= "адъювантная полихимиотерапия";
		dictionary.another_option					= "свой вариант";
		dictionary.another_organ_resect				= "резекция других органов";
		dictionary.back								= "задняя";
		dictionary.bilirubin_level_at_operation		= "уровень билирубина на момент операции";
		dictionary.birthdate						= "дата рождения";
		dictionary.bud								= "почка";
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
		dictionary.non_pancreatobiliary_sickness	= "не панкреатобидиарные";
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
		dictionary.pre_op_lab_ca_level_19			= "уровень са 19.9";
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
		dictionary.study_retirement_date			= "дата выбытия из исследования";
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
		dictionary.calculated_status				= "статус";

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

		return result == "undefined" ? med_item : result;
	};

	var	GetMedicalItemValueSpelling = function(value)
	{
		let result = value;

		if(value == "Y") result = "да";

		return result;
	};


	// --- UI update
	// input:	selector	- tag to update
	//			class_list	- classes to replace instead of existing fa-classes
	//			message		- message to write
	var ChangeStageState = function(selector, class_list, message) {
		let error = null;
		let image_tag = document.getElementsByClassName(selector + "-image")[0];

		if(image_tag == undefined) {
			error = new Error("tag not found");
			console.error(error);
			return {error: error};
		}

		system_calls.RemoveClassesFromTag(image_tag, "fa");
		image_tag.className += " " + class_list;

		let comment_tag = document.getElementsByClassName(selector + "-comment")[0];

		if(comment_tag == undefined) {
			error = new Error("tag not found");
			console.error(error);
			return {error: error};
		}

		comment_tag.innerHTML = message;

		return {error: error};
	}

	var GetMaxEpochs = function () {
		return 50;
	}

	return {
		GetRussianSpelling: GetRussianSpelling,
		GetMedicalItemNameSpelling: GetMedicalItemNameSpelling,
		GetMedicalItemValueSpelling: GetMedicalItemValueSpelling,
		ChangeStageState: ChangeStageState,
		GetMaxEpochs: GetMaxEpochs,
	};

})();

