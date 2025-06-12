var	hospitals_list = hospitals_list || {};

var	hospitals_list = (function()
{
	'use strict';

	var	data_global;
	var	hospitals_obj_global = [];
	var	new_hospital_global = {};
	var	new_doctor_global = {};
	var	admin_mode_global = "";


	var	Init = function()
	{
		$.ajaxSetup({ cache: false });

		GetInitialData();

		$("#AreYouSureRemoveHospital .submit")	.on("click", ConfirmHospitalRemove_ClickHandler);
		$("#AreYouSureRemoveDoctor .submit")	.on("click", ConfirmDoctorRemove_ClickHandler);
		$("#DataSharing .submit")				.on("click", ConfirmDataSharing_ClickHandler);
	};

	var	GetInitialData = function()
	{
		var		currTag = $(".container").first();


		$.getJSON(
			'/cgi-bin/doctor.cgi',
			{
				"action":"AJAX_getCompanyList",
			})
			.done(function(data)
			{
				if(data.result == "success")
				{
					data_global = data;
					admin_mode_global = data.users[0].aaa;
					hospitals_obj_global = hospitals_arr.CraftHospitalObjects(data.companies, admin_mode_global);

					InitHospitalsCallback();
					RenderHospitalList_DOM();
					InitNewHospital();
					InitNewDoctor();
				}
				else
				{
					system_calls.PopoverError(currTag, "Ошибка: " + data.description);
				}
			})
			.fail(function(data)
			{
				setTimeout(function() {
					system_calls.PopoverError(currTag, "Ошибка ответа сервера");
				}, 500);
			});
	};

	var	GetEditableHospitalList_DOM = function()
	{
		var		result = $();

		hospitals_obj_global.forEach(function(hospital)
		{
			result = result.add(hospital.GetDOM());
		});

		return result;
	};

	var	RenderHospitalList_DOM = function()
	{
		$("#hospitals_list").empty().append(GetEditableHospitalList_DOM());
	};

	var	ConfirmHospitalRemove_ClickHandler = function()
	{
		var		curr_tag = $(this);
		var		id = curr_tag.attr("data-id");

		curr_tag.attr("disabled", "");

		$.getJSON(
			'/cgi-bin/doctor.cgi',
			{
				action: curr_tag.attr("data-action"),
				id: curr_tag.attr("data-id"),
				value: "fake",
			})
			.done(function(data)
			{
				if(data.result == "success")
				{
					$("#AreYouSureRemoveHospital").modal("hide");
					setTimeout(function() { $("#collapsible_hospital_" + id).collapse("hide"); } , 100);
					setTimeout(function() { $(".hospital_" + id).hide(300); } , 300);
					setTimeout(function() { $(".hospital_" + id).remove(); } , 1000);
				}
				else
				{
					// --- install previous value, due to error
					system_calls.PopoverError(curr_tag, "Ошибка: " + data.description);
				}
			})
			.fail(function(e)
			{
				system_calls.PopoverError(curr_tag, "Ошибка ответа сервера");
			})
			.always(function(e)
			{
				curr_tag.removeAttr("disabled");
			});
	};

	var	ConfirmDoctorRemove_ClickHandler = function()
	{
		var		curr_tag = $(this);
		var		id = curr_tag.attr("data-id");

		curr_tag.attr("disabled", "");

		$.getJSON(
			'/cgi-bin/doctor.cgi',
			{
				action: curr_tag.attr("data-action"),
				id: curr_tag.attr("data-id"),
				value: "fake",
			})
			.done(function(data)
			{
				if(data.result == "success")
				{
					$("#AreYouSureRemoveDoctor").modal("hide");
					setTimeout(function() { $("#collapsible_doctor_" + id).collapse("hide"); } , 100);
					setTimeout(function() { $(".doctor_" + id).hide(300); } , 300);
					setTimeout(function() { $(".doctor_" + id).remove(); } , 1000);
				}
				else
				{
					// --- install previous value, due to error
					system_calls.PopoverError(curr_tag, "Ошибка: " + data.description);
				}
			})
			.fail(function(e)
			{
				system_calls.PopoverError(curr_tag, "Ошибка ответа сервера");
			})
			.always(function(e)
			{
				curr_tag.removeAttr("disabled");
			});
	};

	var	ConfirmDataSharing_ClickHandler = function()
	{
		var		curr_tag = $(this);
		var		id = curr_tag.attr("data-id");
		let		companies = [];

		$("#DataSharing .hospital").each(function()
		{
			let	hospital = $(this);
			if(hospital.is(":checked"))	companies.push(hospital.attr("data-hospital_id"));
		});

		curr_tag.attr("disabled", "");

		$.getJSON(
			'/cgi-bin/doctor.cgi',
			{
				action: "AJAX_updateDataAccess",
				id: curr_tag.attr("data-id"),
				value: companies.join(),
			})
			.done(function(data)
			{
				if(data.result == "success")
				{
					curr_tag.closest(".modal").modal("hide");
				}
				else
				{
					// --- install previous value, due to error
					system_calls.PopoverError(curr_tag, "Ошибка: " + data.description);
				}
			})
			.fail(function(e)
			{
				system_calls.PopoverError(curr_tag, "Ошибка ответа сервера");
			})
			.always(function(e)
			{
				curr_tag.removeAttr("disabled");
			});
	};

	var	GetHospitalSelectDOM = function(companies, random_global = "")
	{
		let	row				= $("<div>")	.addClass("row form-group");
		let	col_1			= $("<div>")	.addClass("col-xs-5 col-xs-offset-2 col-md-2 col-md-offset-1");
		let	col_2			= $("<div>")	.addClass("col-xs-4 col-md-2");
		let	input_select	= $("<select>")	.addClass("transparent __doctor __hospital_employee")
											.attr("data-random", random_global);

		companies.forEach(function(item)
		{
			input_select.append($("<option>").attr("value", item.id).append(item.title));
		});

		row
			.append(col_1.append("Работает в мед. центре"))
			.append(col_2.append(input_select));

		return row;
	};

	var	InitNewHospital = function()
	{
		new_hospital_global = new hospital_obj();
		new_hospital_global.Init();
		new_hospital_global.SetGlobalData();
		// new_hospital_global.DefaultExpand();
		new_hospital_global.RemoveButton("hidden");
		new_hospital_global.ExpandButton("hidden");
		new_hospital_global.ResetFormButton("", InitNewHospital);
		new_hospital_global.SubmitButton("");
		new_hospital_global.SetSubmitCallback(NewHospital_Callback);
		new_hospital_global.SetDataSharingFlag(false);

		$("#new_hospital_template").empty().append(new_hospital_global.GetDOM());
	};

	var	InitNewDoctor = function()
	{
		new_doctor_global = new doctor_obj();
		new_doctor_global.Init();
		new_doctor_global.SetGlobalData();
		// new_doctor_global.DefaultExpand();
		new_doctor_global.RemoveButton("hidden");
		new_doctor_global.ExpandButton("hidden");
		new_doctor_global.ResetFormButton("", InitNewDoctor);
		new_doctor_global.SubmitButton("");
		new_doctor_global.SetSubmitCallback(NewDoctor_Callback);
		new_doctor_global.AppendHospitalSelect(GetHospitalSelectDOM(data_global.companies, new_doctor_global.GetRandomGlobal()));
		new_doctor_global.SetAdminMode(admin_mode_global);


		$("#new_doctor_template").empty().append(new_doctor_global.GetDOM());
	};

	var	NewHospital_Callback = function()
	{
		$("#collapsible_hospital_new_item").collapse("hide");
		InitNewHospital();
		GetInitialData();
	};

	var	NewDoctor_Callback = function()
	{
		$("#collapsible_doctor_new_item").collapse("hide");
		InitNewDoctor();
		GetInitialData();
	};

	var	InitHospitalsCallback = function()
	{
		hospitals_obj_global.forEach(function(item)
			{
				item.SetAccessListCallback(ShowDataSharingModal_ClickHandler);
			});		
	};

	var	ShowDataSharingModal_ClickHandler = function(e)
	{
		var curr_tag = $(this);
		let	submit_button = $("#DataSharing .submit");
		let	hospital_id = curr_tag.attr("data-id");

		$("#DataSharing").modal("show");
		$("#DataSharing .submit").attr("data-id", hospital_id);

		$.getJSON(
			'/cgi-bin/doctor.cgi',
			{
				action: "AJAX_getCompanyDataAccess",
				id: curr_tag.attr("data-id"),
				value: "fake",
			})
			.done(function(data)
			{
				if(data.result == "success")
				{
					RenderHospitalsAccessList(data.company_id);
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
			});

	};

	var	GetHospitalAccessList_DOM = function(companies_id)
	{
		let		result = $();

		data_global.companies.forEach(function(company)
		{
			let	row = $("<div>");
			let	label = $("<label>")	.attr("style", "font-weight: normal;");
			let	checkbox = $("<input>")	.attr("type", "checkbox")
										.addClass("hospital");

			checkbox.attr("data-hospital_id", company.id);

			if(companies_id.indexOf(parseInt(company.id)) >= 0)
				checkbox.prop("checked", "checked");

			row.append(
					label.append(checkbox).append(" " + company.title)
			);

			result = result.add(row);
		});

		return result;
	};

	var	RenderHospitalsAccessList = function(companies_id)
	{
		$("#DataSharing .modal-body").empty().append(GetHospitalAccessList_DOM(companies_id));
	};



	return {
		Init: Init
	};

})();
