/*globals jsSHA*/
/*exported doctors_arr*/

var	doctor_obj = function()
{
	"use strict";


	let	data_global;
	let	random_global;

	let	details_area_state_global = "";
	let expand_button_state_global = "";
	let remove_button_state_global = "";
	let	reset_form_button_global = "hidden";
	let	reset_form_callback_global;
	let	submit_button_global = "hidden";
	let	submit_callback_global;
	let	admin_mode_global = "";
	let	append_hospital_dom_global;


	var	Init = function()
	{
		do
		{
			random_global = Math.floor(Math.random() * 4567890987654321);
		} while($("div.__doctor[data-random=\"" + random_global + "\"]").length);

		system_calls.SetCurrentScript("doctor.cgi");
	};

	var	SetGlobalData = function(data_init, admin_mode_local)
	{
		if(typeof data_init 				== "undefined") data_init = {};
		if(typeof data_init.id				== "undefined") data_init.id = "0";
		if(typeof data_init.aaa				== "undefined") data_init.aaa = "";
		if(typeof data_init.name_first		== "undefined") data_init.name_first = "";
		if(typeof data_init.name_last		== "undefined") data_init.name_last = "";
		if(typeof data_init.name_middle		== "undefined") data_init.name_middle = "";
		if(typeof data_init.login			== "undefined") data_init.login = "";
		if(typeof data_init.email			== "undefined") data_init.email = "";
		if(typeof data_init.phone			== "undefined") data_init.phone = "";
		if(typeof data_init.is_admin		== "undefined") data_init.is_admin = "";
		if(typeof data_init.isblocked		== "undefined") data_init.isblocked = "";

		data_global = data_init;
		admin_mode_global = admin_mode_local;
	};

	var	CheckNewDoctorValidity = function(curr_tag)
	{
		let result = true;

		let login				= $("input.__doctor.__login[data-random=\"" + random_global + "\"]");
		let email				= $("input.__doctor.__email[data-random=\"" + random_global + "\"]");
		let phone				= $("input.__doctor.__phone[data-random=\"" + random_global + "\"]");
		let pass				= $("input.__doctor.__password[data-random=\"" + random_global + "\"]");

		if(phone.val().length && (phone.val().length != 10))
		{
			let message = "Необходимо указать 10 цифр номера (без 8, без +7)";
			system_calls.PopoverError(phone, message);
			system_calls.PopoverError(curr_tag, message);
			result = false;
		}
		if(pass.val().length === 0)
		{
			let message = "Необходимо указать пароль";
			system_calls.PopoverError(pass, message);
			system_calls.PopoverError(curr_tag, message);
			result = false;
		}
		if(login.val().length)
		{
			if(login.val().search(/[a-zA-Z]/) == -1)
			{
				let message = "Логин должен содержать буквы";
				system_calls.PopoverError(login, message);
				system_calls.PopoverError(curr_tag, message);
				result = false;
			}
		}
		else
		{
			if(email.val().length) 
			{
				login.val(email.val());
			}
			else
			{
				let message = "Логин обязателен";
				system_calls.PopoverError(login, message);
				system_calls.PopoverError(curr_tag, message);
				result = false;
			}
		}

		return result;
	};

	var SubmitNewDoctor_ClickHandler = function()
	{
		var	curr_tag = $(this);

		let name_first			= $("input.__doctor.__name_first[data-random=\"" + random_global + "\"]");
		let name_last			= $("input.__doctor.__name_last[data-random=\"" + random_global + "\"]");
		let name_middle			= $("input.__doctor.__name_middle[data-random=\"" + random_global + "\"]");
		let login				= $("input.__doctor.__login[data-random=\"" + random_global + "\"]");
		let email				= $("input.__doctor.__email[data-random=\"" + random_global + "\"]");
		let phone				= $("input.__doctor.__phone[data-random=\"" + random_global + "\"]");
		let pass				= $("input.__doctor.__password[data-random=\"" + random_global + "\"]");
		let isblocked			= $("input.__doctor.__isblocked[data-random=\"" + random_global + "\"]");
		let is_admin			= $("input.__doctor.__is_admin[data-random=\"" + random_global + "\"]");
		let hospital			= $("select.__doctor.__hospital_employee[data-random=\"" + random_global + "\"]");

		var action = curr_tag.attr("data-action");

		if(action.length)
		{
				if(CheckNewDoctorValidity(curr_tag))
				{
					curr_tag.button("loading");
					
					$.getJSON(
						"/cgi-bin/doctor.cgi",
						{
							action		: action,
							login		: login.val(),
							email		: email.val(),
							country_code: phone.val().length ? "7" : "",
							phone		: phone.val(),
							pass		: pass.val(),
							name_first	: name_first.val(),
							name_last	: name_last.val(),
							name_middle	: name_middle.val(),
							isblocked	: isblocked.val(),
							is_admin	: is_admin.val(),
							hospital	: hospital.val(),
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
						.fail(function()
						{
							system_calls.PopoverError(curr_tag, "Ошибка ответа сервера");
						})
						.always(function()
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

	var	GetRandomGlobal = function() { return random_global; };

	var SetAdminMode = function(mode)
	{
		admin_mode_global = mode;
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

	var ResetFormButton = function(state, reset_form_callback)
	{
		reset_form_button_global = state;
		reset_form_callback_global = reset_form_callback;
	};

	var SetSubmitCallback = function(f)
	{
		submit_callback_global = f;
	};

	var	GetUserDOM = function()
	{
		let		row = $("<div>").addClass("row");
		let		col = $("<div>").addClass("col-xs-12");
		let		doctor_fio = data_global.name_last + " " + data_global.name_first + " " + data_global.name_middle;

		if(doctor_fio.length == 2) doctor_fio = "Не указано";

		return row.append(col.append(doctor_fio));
	};

	var	GetAdminDOM = function()
	{
		var		result = $();

		var		row	 					= $("<div>")	.addClass("row __doctor highlight_onhover zebra_painting doctor_" + data_global.id);
		var		open_button				= $("<i>")		.addClass("fa fa-expand padding_close cursor_pointer animate_scale_onhover " + expand_button_state_global);
		var		input_name_first		= $("<input>")	.addClass("transparent __doctor __name_first")			.attr("placeholder", "Имя");
		var		input_name_middle		= $("<input>")	.addClass("transparent __doctor __name_middle")			.attr("placeholder", "Отчество");
		var		input_name_last			= $("<input>")	.addClass("transparent __doctor __name_last")			.attr("placeholder", "Фамилия");
		var		input_login				= $("<input>")	.addClass("transparent __doctor __login")				.attr("placeholder", "Логин");
		var		input_email				= $("<input>")	.addClass("transparent __doctor __email")				.attr("placeholder", "email");
		var		input_phone				= $("<input>")	.addClass("transparent __doctor __phone")				.attr("placeholder", "Телефон");
		var		input_pass				= $("<input>")	.addClass("transparent __doctor __password")			.attr("placeholder", "Пароль");
		var		remove_button			= $("<i>")		.addClass("fa fa-times-circle padding_close float_right cursor_pointer animate_close_onhover  " + remove_button_state_global);
		var		open_col	 			= $("<div>")	.addClass("col-xs-2 col-md-1");
		var		col_login	 			= $("<div>")	.addClass("col-xs-4 col-md-2 __doctor_collapsible_login_" + random_global);
		var		col_email	 			= $("<div>")	.addClass("hidden-xs hidden-sm col-md-2 __doctor_collapsible_email_" + random_global);
		var		col_phone	 			= $("<div>")	.addClass("hidden-xs hidden-sm col-md-2 __doctor_collapsible_phone_" + random_global);
		var		col_pass				= $("<div>")	.addClass("col-xs-4 col-md-2 col-xs-offset-1 col-md-offset-0");
		// var		comment_col 		= $("<div>")	.addClass("col-xs-4 col-md-8");
		var		remove_col				= $("<div>")	.addClass("col-xs-1 col-md-1 col-md-offset-2");
		var		reset_form_button		= $("<button>")	.addClass("btn btn-default form-control " + reset_form_button_global).append("Сбросить");
		var		submit_button			= $("<button>")	.addClass("btn btn-primary form-control " + submit_button_global).append("Сохранить");

		// --- render collapsible part
		var		row_collapsible 		= $("<div>")	.addClass("row collapse " + details_area_state_global);
		var		col_collapsible_content = $("<div>")	.addClass("col-xs-12");
		var		row_submit 				= $("<div>")	.addClass("row __doctor_submit hospital" + data_global.id);
		var		reset_form_col 			= $("<div>")	.addClass("col-xs-6 col-md-offset-8 col-md-2");
		var		submit_col 				= $("<div>")	.addClass("col-xs-6 col-md-2");

		var		collapsible_row_1		= $("<div>")	.addClass("row highlight_onhover");
		var		col_name_last 			= $("<div>")	.addClass("col-xs-4 col-md-2 col-md-offset-1");
		var		col_name_first 			= $("<div>")	.addClass("col-xs-4 col-md-2");
		var		col_name_middle			= $("<div>")	.addClass("col-xs-4 col-md-2");
		var		col_admin				= $("<div>")	.addClass("col-xs-2 col-md-1 col-md-offset-0");
		var		col_admin_hint			= $("<div>")	.addClass("col-xs-3 col-md-1");
		var		col_active				= $("<div>")	.addClass("col-xs-2 col-md-1");
		var		col_active_hint			= $("<div>")	.addClass("col-xs-3 col-md-1");

		var		collapsible_row_2		= $("<div>")	.addClass("row highlight_onhover");
		var		col_visibility_desc		= $("<div>")	.addClass("col-xs-6 col-md-2 col-md-offset-1");
		var		col_visibility_scope	= $("<div>")	.addClass("col-xs-6 col-md-2");

		var		admin_switcher			= $("<div>")	.addClass("form-switcher")
														.append($("<input>")
															.attr("id", "admin_switch_edit_" + data_global.id)
															.attr("name", "admin_switch_edit_" + data_global.id)
															.attr("type", "checkbox")
															.prop("checked", (data_global.aaa == "admin" ? "checked" : ""))
														)
														.append($("<label>")
															.addClass("switcher")											
															.attr("id", "label_admin_switch_edit_" + data_global.id)
															.attr("for", "admin_switch_edit_" + data_global.id)
															.attr("data-id", data_global.id)
															.attr("data-action", "AJAX_updateUserType_SwitcherInitiated")
															.attr("data-toggle", "tooltip")
															.attr("data-placement", "top")
															.attr("title", "Редактирование прав пользователя")
															.attr("data-hint_positive", "admin")
															.attr("data-hint_negative", "обычный")
															.attr("data-hint_selector", "#hint_admin_switch_edit_" + data_global.id)
															.on("click", Switcher_ClickHandler)
														);

		var		user_active_switcher	= $("<div>").addClass("form-switcher")
													.append($("<input>")
														.attr("id", "user_active_switch_edit_" + data_global.id)
														.attr("name", "user_active_switch_edit_" + data_global.id)
														.attr("type", "checkbox")
														.prop("checked", (data_global.isblocked == "N" ? "checked" : ""))
													)
													.append($("<label>")
														.addClass("switcher")											
														.attr("id", "label_user_active_switch_edit_" + data_global.id)
														.attr("for", "user_active_switch_edit_" + data_global.id)
														.attr("data-id", data_global.id)
														.attr("data-action", "AJAX_updateUserBlock")
														.attr("data-toggle", "tooltip")
														.attr("data-placement", "top")
														.attr("title", "Блокировка пользователя")
														.attr("data-hint_positive", "активен")
														.attr("data-hint_negative", "заблокирован")
														.attr("data-hint_selector", "#hint_user_active_switch_edit_" + data_global.id)
														.on("click", Switcher_ClickHandler)
													);

		var		visibility_scope_select	= $("<select>")
												.addClass("form-control")
												.attr("data-id", data_global.id)
												.attr("data-script", "doctor.cgi")
												.attr("data-action", "AJAX_updateDoctorVisibilityScope")
												.attr("data-db_value", data_global.visibility_scope)
												.append(
													$("<option>")
														.attr("value", "local")
														.append("Свой центр")
													)
												.append(
													$("<option>")
														.attr("value", "global")
														.append("Все центры")
													)
												.on("change", system_calls.UpdateInputFieldOnServer)
												.val(data_global.visibility_scope);

		col_admin_hint		.attr("id", "hint_admin_switch_edit_" + data_global.id);
		col_active_hint		.attr("id", "hint_user_active_switch_edit_" + data_global.id);

		row_collapsible		.attr("id", "collapsible_doctor_" + data_global.id)
							.append($("<div>").addClass("col-xs-12 collapse-top-shadow margin_bottom_20").append("<p>"))
							.append(col_collapsible_content)
							.append($("<div>").addClass("col-xs-12 collapse-bottom-shadow margin_top_20").append("<p>"));

		col_collapsible_content
							.append(collapsible_row_1)
							.append(collapsible_row_2);

		collapsible_row_1
							.append(col_name_last		.append(input_name_last)	.append($("<label>")))
							.append(col_name_first		.append(input_name_first)	.append($("<label>")))
							.append(col_name_middle		.append(input_name_middle)	.append($("<label>")))
							.append(col_admin			.append(admin_switcher))
							.append(col_admin_hint)
							.append(col_active			.append(user_active_switcher))
							.append(col_active_hint);

		collapsible_row_2
							.append(col_visibility_desc	.append("Доступ к мед. записям:"))
							.append(col_visibility_scope.append(visibility_scope_select));

		open_button			.attr("data-target", "collapsible_doctor_" + data_global.id)
							.attr("data-toggle", "collapse");


		// --- render main info part
		input_name_first	.val(data_global.name_first)
							.attr("data-db_value", data_global.name_first)
							.attr("data-script", "doctor.cgi");
		input_name_middle	.val(data_global.name_middle)
							.attr("data-db_value", data_global.name_middle)
							.attr("data-script", "doctor.cgi");
		input_name_last		.val(data_global.name_last)
							.attr("data-db_value", data_global.name_last)
							.attr("data-script", "doctor.cgi");
		input_login			.val(data_global.login)
							.attr("data-db_value", data_global.login)
							.attr("data-script", "doctor.cgi");
		input_phone			.val(data_global.phone)
							.attr("data-db_value", data_global.phone)
							.attr("data-script", "doctor.cgi");
		input_email			.val(data_global.email)
							.attr("data-db_value", data_global.email)
							.attr("data-script", "doctor.cgi");

		input_pass			.attr("type", "password");

		open_button 		.attr("data-id", data_global.id);
		input_name_first	.attr("data-id", data_global.id);
		input_name_middle	.attr("data-id", data_global.id);
		input_name_last		.attr("data-id", data_global.id);
		input_login			.attr("data-id", data_global.id);
		input_email			.attr("data-id", data_global.id);
		input_phone			.attr("data-id", data_global.id);
		input_pass			.attr("data-id", data_global.id);
		remove_button		.attr("data-id", data_global.id);
		reset_form_button	.attr("data-id", data_global.id);
		submit_button		.attr("data-id", data_global.id);

		row					.attr("data-random", random_global);
		open_button			.attr("data-random", random_global);
		input_name_first	.attr("data-random", random_global);
		input_name_middle	.attr("data-random", random_global);
		input_name_last		.attr("data-random", random_global);
		input_login			.attr("data-random", random_global);
		input_email			.attr("data-random", random_global);
		input_phone			.attr("data-random", random_global);
		input_pass			.attr("data-random", random_global);
		remove_button		.attr("data-random", random_global);
		reset_form_button	.attr("data-random", random_global);
		submit_button		.attr("data-random", random_global);

		input_name_first	.attr("data-action", "AJAX_updateDoctorFirstName");
		input_name_middle	.attr("data-action", "AJAX_updateDoctorMiddleName");
		input_name_last		.attr("data-action", "AJAX_updateDoctorLastName");
		input_login			.attr("data-action", "AJAX_updateDoctorLogin");
		input_email			.attr("data-action", "AJAX_updateDoctorEmail");
		input_phone			.attr("data-action", "AJAX_updateDoctorPhone");
		input_pass			.attr("data-action", "AJAX_updateDoctorPassword");
		remove_button		.attr("data-action", "AJAX_deleteDoctor");
		submit_button		.attr("data-action", "AJAX_addDoctor");

		open_button			.on("click",  TriggerCollapsible_ClickHandler);
		input_name_first	.on("change", system_calls.UpdateInputFieldOnServer);
		input_name_middle	.on("change", system_calls.UpdateInputFieldOnServer);
		input_name_last		.on("change", system_calls.UpdateInputFieldOnServer);
		input_login			.on("change", system_calls.UpdateInputFieldOnServer);
		input_email			.on("change", system_calls.UpdateInputFieldOnServer);
		input_phone			.on("change", system_calls.UpdateInputFieldOnServer);
		input_pass			.on("change", function(e)
										{
											var		curr_tag = $(this);
											var 	shaObj = new jsSHA("SHA-512", "TEXT");

											shaObj.update(curr_tag.val());
											curr_tag.val(shaObj.getHash("HEX"));

											return system_calls.UpdateInputFieldOnServer(e);
										});
		admin_switcher		.on("change", UpdateSwitcherHintValues);
		user_active_switcher.on("change", UpdateSwitcherHintValues);
		remove_button		.on("click",  RemoveCompany_AreYouSure_ClickHandler);
		reset_form_button	.on("click",  reset_form_callback_global);
		submit_button		.on("click",  SubmitNewDoctor_ClickHandler);

		open_col			.append(open_button);
/*		if(typeof data_global.companies != "undefined")
			col_login			.append(data_global.companies[0].name);
*/
		col_login			.append(input_login).append($("<label>"));
		col_email			.append(input_email).append($("<label>"));
		col_phone			.append(input_phone).append($("<label>"));
		col_pass			.append(input_pass).append($("<label>"));


		remove_col			.append(remove_button);
		reset_form_col		.append(reset_form_button);
		submit_col			.append(submit_button);

		row
			.append(open_col)
			.append(col_login).append(col_email).append(col_phone).append(col_pass)
			.append(remove_col);

		row_submit
			.append(reset_form_col)
			.append(submit_col);

		result = result.add(row);
		result = result.add(row_collapsible);
		if(append_hospital_dom_global) result = result.add(append_hospital_dom_global);
		result = result.add(row_submit);

		result.find("[data-toggle=\"tooltip\"]").tooltip({ animation: "animated bounceIn"});

		return	result;
	};

	var	GetDOM = function()
	{
		return admin_mode_global == "admin" ? GetAdminDOM() : GetUserDOM();
	};

	var	UpdateSwitcherHintValues = function()
	{
			let		label_tag	= $(this).find("label");
			let		hint_tag	= $(label_tag.attr("data-hint_selector"));
			let		check_box	= $("#" + label_tag.attr("for"));

			hint_tag
				.empty()
				.append(check_box.is(":checked") ? label_tag.attr("data-hint_positive") : label_tag.attr("data-hint_negative"));


	};

	var	TriggerCollapsible_ClickHandler = function()
	{
		var		collapsible_tag_id = $(this).attr("data-target");
		$("#" + collapsible_tag_id).collapse("toggle");
	};

	var	RemoveCompany_AreYouSure_ClickHandler = function()
	{
		var		curr_tag = $(this);

		$("#AreYouSureRemoveDoctor .submit").attr("data-id", curr_tag.attr("data-id"));
		$("#AreYouSureRemoveDoctor .submit").attr("data-action", curr_tag.attr("data-action"));
		$("#AreYouSureRemoveDoctor").modal("show");
	};

	var	Switcher_ClickHandler = function()
	{
		var		curr_tag = $(this);
		var		input_tag = $("#" + $(this).attr("for"));
		var		curr_value = !input_tag.prop("checked");

		$.getJSON(
			"/cgi-bin/doctor.cgi",
			{
				action: curr_tag.data("action"),
				id: curr_tag.data("id"),
				value: (curr_value ? "Y" : "N"),
			})
			.done(function(data)
			{
				if(data.result == "success")
				{
					// --- good2go
				}
				else
				{
					// --- install previous value, due to error
					input_tag.prop("checked", !curr_value).trigger("change");

					system_calls.PopoverError(curr_tag, "Ошибка: " + data.description);
				}
			})
			.fail(function()
			{
				input_tag.prop("checked", !curr_value).trigger("change");
				system_calls.PopoverError(curr_tag, "Ошибка ответа сервера");
			})
			.always(function()
			{
				curr_tag.removeAttr("disabled");
			});

		return true;
	};

	var	AppendHospitalSelect = function(dom)
	{
		append_hospital_dom_global = dom;

	};


	return {
		Init: Init,
		GetRandomGlobal: GetRandomGlobal,
		SetAdminMode: SetAdminMode,
		SetGlobalData: SetGlobalData,
		DefaultExpand: DefaultExpand,
		ExpandButton: ExpandButton,
		RemoveButton: RemoveButton,
		ResetFormButton: ResetFormButton,
		SubmitButton: SubmitButton,
		SetSubmitCallback: SetSubmitCallback,
		AppendHospitalSelect: AppendHospitalSelect,
		GetDOM: GetDOM,
	};

};


var	doctors_arr = (function()
{
	var	CraftDoctorObjects = function(doctors_in, mode)
	{
		var	doctors_out = [];

		if((typeof(doctors_in) != "undefined"))
		{
			doctors_in.forEach(function(hospital)
			{
				var		temp_obj = new doctor_obj();

				temp_obj.SetGlobalData(hospital);
				temp_obj.Init();
				temp_obj.SetAdminMode(mode);

				doctors_out.push(temp_obj);
			});
		}
		else
		{
			system_calls.PopoverError("body", "Ошибка в объекте doctors_in");
		}

		return doctors_out;
	};

	return {
		CraftDoctorObjects: CraftDoctorObjects,
	};
})();
