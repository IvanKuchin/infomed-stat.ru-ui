var	hospital_obj = function()
{
	'use strict';

	var	data_global;
	var	random_global;

	var	details_area_state_global = "";
	var expand_button_state_global = "";
	var remove_button_state_global = "";
	var	reset_form_button_global = "hidden";
	var	reset_form_callback_global;
	var	submit_button_global = "hidden";
	var	hospital_obj_global = {};
	var	submit_callback_global;
	var	append_label = true;
	var	admin_mode_global = "";
	var	doctors_global;
	var	data_sharing_flag_global = true;
	var	access_list_callback_global;

	var	Init = function()
	{
		do
		{
			random_global = Math.floor(Math.random() * 4567890987654321);
		} while($("div.__hospital[data-random=\"" + random_global + "\"]").length);

		system_calls.SetCurrentScript("doctor.cgi");
	};

	var	SetGlobalData = function(data_init, admin_mode_init)
	{
		if(typeof data_init 				== "undefined") data_init = {};
		if(typeof data_init.id				== "undefined") data_init.id = "0";
		if(typeof data_init.title			== "undefined") data_init.title = "";
		if(typeof data_init.employees		== "undefined") data_init.employees = [];

		data_global = data_init;
		admin_mode_global = admin_mode_init;

		doctors_global = doctors_arr.CraftDoctorObjects(data_init.employees, admin_mode_global);
	};

	var	GetID		= function() { return data_global.id; };
	var	GetTitle	= function() { return data_global.title; };

	var	CheckNewHospitalValidity = function(curr_tag)
	{
		let result = true;

		return result;
	};

	var SubmitNewCompany_ClickHandler = function(e)
	{
		var	curr_tag = $(this);
		var	title_tag = $("input.__hospital_title[data-random=\"" + random_global + "\"]");

		var action = curr_tag.attr("data-action");

		if(action.length)
		{
				if(CheckNewHospitalValidity(curr_tag))
				{
					curr_tag.button("loading");
					
					$.getJSON(
						'/cgi-bin/doctor.cgi',
						{
							action: action,
							title: title_tag.val(),
						})
						.done(function(data)
						{
							if(data.result == "success")
							{
								if(typeof(submit_callback_global) == "function")
								{
									submit_callback_global();
								}
							}
							else
							{
								system_calls.PopoverError(curr_tag, "Ошибка: " + data.description);
							}
						})
						.fail(function(data)
						{
							system_calls.PopoverError(curr_tag, "Ошибка ответа сервера");
						})
						.always(function(data)
						{
							setTimeout(function(){ curr_tag.button("reset"); }, 500);
						});
				}
				else
				{
					system_calls.PopoverError(curr_tag, "Исправьте данные");
				}
		}
		else
		{
			system_calls.PopoverError(curr_tag, "не указано действие");
		}
	};

	var DefaultExpand = function()
	{
		details_area_state_global = "in";
	};

	var ExpandButton = function(state)
	{
		expand_button_state_global = state;
	};

	var RemoveButton = function(state)
	{
		remove_button_state_global = state;
	};

	var SubmitButton = function(state)
	{
		submit_button_global = state;
	};

	var	DontAppendLabel = function()
	{
		append_label = false;
	};

	var ResetFormButton = function(state, reset_form_callback)
	{
		reset_form_button_global = state;
		reset_form_callback_global = reset_form_callback;
	};

	var SetSubmitCallback = function(f)
	{
		submit_callback_global = f;
	};

	var SetDataSharingFlag = function(f)
	{
		data_sharing_flag_global = f;
	};

	var	SetAccessListCallback = function(f)
	{
		access_list_callback_global = f;
	}

	var	GetDOM = function()
	{
		var		result = $();

		var		row	 				= $("<div>")	.addClass("row __hospital highlight_onhover zebra_painting hospital_" + data_global.id);
		var		open_button			= $("<i>")		.addClass("fa fa-expand padding_close cursor_pointer animate_scale_onhover " + expand_button_state_global);
		var		input_title			= $("<input>")	.addClass("transparent __hospital_title hospital" + data_global.id).attr("placeholder", "Название");
		var		input_comment		= $("<input>")	.addClass("transparent __hospital_description hospital" + data_global.id).attr("placeholder", "Коментарий (необязательно)");
		var		remove_button		= $("<i>")		.addClass("fa fa-times-circle padding_close float_right cursor_pointer animate_close_onhover  " + remove_button_state_global);
		var		open_col	 		= $("<div>")	.addClass("col-xs-2 col-md-1");
		var		title_col	 		= $("<div>")	.addClass("col-xs-4 col-md-5 __hospital_collapsible_title_" + random_global);
		var		data_sharing_col	= $("<div>")	.addClass("col-xs-4 col-md-5 __hospital_collapsible_data_sharing_" + random_global);
		var		data_sharing_link	= $("<button>")	.addClass("btn btn-link").append("доступ к данным");
		// var		comment_col = 		$("<div>")	.addClass("col-xs-4 col-md-8");
		var		remove_col			= $("<div>")	.addClass("col-xs-2 col-md-1");
		var		reset_form_button	= $("<button>")	.addClass("btn btn-default form-control " + reset_form_button_global).append("Сбросить");
		var		submit_button		= $("<button>")	.addClass("btn btn-primary form-control " + submit_button_global).append("Сохранить");
		var		temp = [];

		// --- render collapsible part
		var		row_collapsible 	= $("<div>")	.addClass("row collapse " + details_area_state_global);
		var		col_collapsible_content = $("<div>").addClass("col-xs-12");
		var		row_submit 			= $("<div>")	.addClass("row __hospital_submit hospital" + data_global.id);
		var		reset_form_col 		= $("<div>")	.addClass("col-xs-6 col-md-offset-8 col-md-2");
		var		submit_col 			= $("<div>")	.addClass("col-xs-6 col-md-2");

		var		col_main_fields		= $("<div>")	.addClass("col-xs-12");
		var		col_custom_fields	= $("<div>")	.addClass("col-xs-12");

		row_collapsible		.attr("id", "collapsible_hospital_" + data_global.id)
							.append($("<div>").addClass("col-xs-12 collapse-top-shadow margin_bottom_20").append("<p>"))
							.append(col_collapsible_content)
							.append($("<div>").addClass("col-xs-12 collapse-bottom-shadow margin_top_20").append("<p>"));

		doctors_global.forEach(function(doctor)
		{
			col_collapsible_content.append(doctor.GetDOM());
		});

		open_button			.attr("data-target", "collapsible_hospital_" + data_global.id)
							.attr("data-toggle", "collapse");


		// --- render main info part
		input_title			.val(data_global.title)
							.attr("data-db_value", data_global.title)
							.attr("data-script", "doctor.cgi");
		input_comment		.val(data_global.description)
							.attr("data-db_value", data_global.description)
							.attr("data-script", "doctor.cgi");

		open_button 		.attr("data-id", data_global.id);
		input_title			.attr("data-id", data_global.id);
		input_comment		.attr("data-id", data_global.id);
		remove_button		.attr("data-id", data_global.id);
		reset_form_button	.attr("data-id", data_global.id);
		submit_button		.attr("data-id", data_global.id);
		data_sharing_link	.attr("data-id", data_global.id);

		row					.attr("data-random", random_global);
		open_button			.attr("data-random", random_global);
		input_title			.attr("data-random", random_global);
		input_comment		.attr("data-random", random_global);
		remove_button		.attr("data-random", random_global);
		reset_form_button	.attr("data-random", random_global);
		submit_button		.attr("data-random", random_global);
		data_sharing_link	.attr("data-random", random_global);

		input_title			.attr("data-action", "AJAX_updateCompanyTitle");
		input_comment		.attr("data-action", "AJAX_updateCompanyDescription");
		remove_button		.attr("data-action", "AJAX_deleteCompany");
		submit_button		.attr("data-action", "AJAX_addCompany");
		data_sharing_link	.attr("data-action", "");

		open_button			.on("click",  TriggerCollapsible_ClickHandler);
		input_title			.on("change", system_calls.UpdateInputFieldOnServer);
		input_comment		.on("change", system_calls.UpdateInputFieldOnServer);
		remove_button		.on("click",  RemoveCompany_AreYouSure_ClickHandler);
		reset_form_button	.on("click",  reset_form_callback_global);
		submit_button		.on("click",  SubmitNewCompany_ClickHandler);
		data_sharing_link	.on("click",  access_list_callback_global);

		open_col			.append(open_button);
/*		if(typeof data_global.companies != "undefined")
			title_col			.append(data_global.companies[0].name);
*/
		title_col			.append(input_title)
		if(append_label)
			title_col 		.append($("<label>"));
		if(data_sharing_flag_global)
			data_sharing_col.append(data_sharing_link);
		remove_col			.append(remove_button);
		reset_form_col		.append(reset_form_button);
		submit_col			.append(submit_button);




		row
			.append(open_col)
			.append(title_col).append(data_sharing_col)
			.append(remove_col);

		row_submit
			.append(reset_form_col)
			.append(submit_col);

		result = result.add(row);
		result = result.add(row_collapsible);
		result = result.add(row_submit);



		return	result;
	};

	var	TriggerCollapsible_ClickHandler = function(e)
	{
		var		collapsible_tag_id = $(this).attr("data-target");
		$("#" + collapsible_tag_id).collapse("toggle");
	};

	var	RemoveCompany_AreYouSure_ClickHandler = function(e)
	{
		var		curr_tag = $(this);

		$("#AreYouSureRemoveHospital .submit").attr("data-id", curr_tag.attr("data-id"));
		$("#AreYouSureRemoveHospital .submit").attr("data-action", curr_tag.attr("data-action"));
		$("#AreYouSureRemoveHospital").modal("show");
	};

	return {
		Init: Init,
		GetID: GetID,
		GetTitle: GetTitle,
		SetGlobalData: SetGlobalData,
		DefaultExpand: DefaultExpand,
		ExpandButton: ExpandButton,
		RemoveButton: RemoveButton,
		DontAppendLabel: DontAppendLabel,
		ResetFormButton: ResetFormButton,
		SubmitButton: SubmitButton,
		SetSubmitCallback: SetSubmitCallback,
		SetDataSharingFlag: SetDataSharingFlag,
		SetAccessListCallback: SetAccessListCallback,
		GetDOM: GetDOM,
	};

};

var	hospitals_arr = (function()
{
	var	CraftHospitalObjects = function(companies, mode)
	{
		var	hospitals = [];

		if((typeof(companies) != "undefined"))
		{
			companies.forEach(function(hospital)
			{
				var		temp_company = new hospital_obj();

				temp_company.SetGlobalData(hospital, mode);
				temp_company.Init();

				if(mode == "admin")
				{
					//  temp_company.DefaultExpand();
					temp_company.RemoveButton("");
				}
				else
				{
					temp_company.DefaultExpand();
					temp_company.RemoveButton("hidden");
					temp_company.DontAppendLabel();
					temp_company.SetDataSharingFlag(false);
				}
				// temp_company.ExpandButton("hidden");


				hospitals.push(temp_company);
			});
		}
		else
		{
			system_calls.PopoverError("body", "Ошибка в объекте companies");
		}

		return hospitals;
	};

	return {
		CraftHospitalObjects: CraftHospitalObjects,
	};
})();
