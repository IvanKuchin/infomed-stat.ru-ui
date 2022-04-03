var	medical_record_list = medical_record_list || {};

var	medical_record_list = (function()
{
	'use strict';

	var	data_global;

	var	Init = function()
	{
		$.ajaxSetup({ cache: false });

		GetInitialData();

		$("#status_filter")						.on("change", DisplayFilter_ChangeHandler);
		$("#AreYouSureRemovePatient .submit")	.on("click", ConfirmPatientRemove_ClickHandler);

	};

	var	GetInitialData = function()
	{
		var		currTag = $(".container").first();


		$.getJSON(
			'/cgi-bin/doctor.cgi',
			{
				"action":"AJAX_getMedicalRecords",
			})
			.done(function(data)
			{
				if(data.result == "success")
				{
					data_global = data;

					RenderMedicalRecords(data_global.medical_records);
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

	var	GetMedicalRecordItem_DOM = function(item)
	{
		let		result				= $();
		let		row	 				= $("<div>")	.addClass("row __med_record_item highlight_onhover");
		let		col_name			= $("<div>")	.addClass("col-xs-6");
		let		col_value			= $("<div>")	.addClass("col-xs-6");

		col_name	.append(infomed_stat.GetMedicalItemNameSpelling(item.name));
		col_value	.append(infomed_stat.GetMedicalItemValueSpelling(item.value));

		result = result.add(row.append(col_name).append(col_value));

		return result;
	};

	var	GetMedicalRecord_DOM = function(medical_record)
	{
		let	result					= $();
		let	isMe					= $("#myUserID").attr("data-myuserid") == medical_record.submitter_user_id;

		var		row	 				= $("<div>")	.addClass("row __med_record highlight_onhover zebra_painting med_record");

		var		open_col	 		= $("<div>")	.addClass("col-xs-2 col-md-1");
		var		last_name_col 		= $("<div>")	.addClass("col-xs-3 col-md-2 __med_record_collapsible_last_name");
		var		first_name_col 		= $("<div>")	.addClass("col-xs-3 col-md-2 __med_record_collapsible_first_name");
		var		middle_name_col 	= $("<div>")	.addClass("col-xs-3 col-md-2 __med_record_collapsible_middle_name");
		var		birthdate_col 		= $("<div>")	.addClass("hidden-xs hidden-sm col-md-2 __med_record_collapsible_birthdate");
		var		edit_col			= $("<div>")	.addClass("col-xs-1 col-md-1");
		var		remove_col			= $("<div>")	.addClass("col-xs-1 col-md-1");

		var		open_button			= $("<i>")		.addClass("fa fa-expand padding_close cursor_pointer animate_scale_onhover ");
		var		input_last_name		= $("<input>")	.addClass("transparent __med_record_last_name med_record").attr("placeholder", "Фамилия");
		var		input_first_name	= $("<input>")	.addClass("transparent __med_record_first_name med_record").attr("placeholder", "Имя");
		var		input_middle_name	= $("<input>")	.addClass("transparent __med_record_middle_name med_record").attr("placeholder", "Отчество");
		var		input_birthdate		= $("<input>")	.addClass("transparent __med_record_birthdate med_record").attr("placeholder", "Дата рождения");
		var		edit_button			= $("<a>")		.attr("href", "/cgi-bin/doctor.cgi?action=medical_record_add_template&patient_id=" + medical_record.id + "&rand=" + Math.random() * 7654345)
													.append(
														$("<i>").addClass("fa fa-pencil padding_close float_right cursor_pointer animate_skewX_onhover")
													);
		var		remove_button		= $("<i>")		.addClass("fa fa-times-circle padding_close float_right cursor_pointer animate_rotate_onhover");

		// --- render collapsible part
		var		row_collapsible 	= $("<div>")	.addClass("row collapse");
		var		col_collapsible_content = $("<div>").addClass("col-xs-12");

		// --- add status attribute
		row		.attr("status-all", "");
		if(medical_record.___death_date.length) 				{ row	.attr("status-event", ""); }
		else if(medical_record.___study_retirement_date.length)	{ row	.attr("status-censored", ""); }
		else													{ row	.attr("status-alive", ""); }

		row_collapsible		.attr("id", "collapsible_med_record_" + medical_record.id)
							.append($("<div>").addClass("col-xs-12 collapse-top-shadow margin_bottom_20").append("<p>"))
							.append(col_collapsible_content)
							.append($("<div>").addClass("col-xs-12 collapse-bottom-shadow margin_top_20").append("<p>"));

		open_button			.attr("data-target", "collapsible_med_record_" + medical_record.id)
							.attr("data-toggle", "collapse");


		{
			let		entries = Object.entries(medical_record);

			for(const [name, value] of entries)
			{
				if(name.search("___") === 0) // --- medical record
				{
					
					if(value.length) // --- value has been defined
					{
						col_collapsible_content.append(GetMedicalRecordItem_DOM({name: name, value: value}));
					}
				}
			}
		}

		// --- render main info part
		input_first_name	.val(medical_record.___first_name)
							.attr("data-db_value", medical_record.___first_name)
							.attr("data-script", "doctor.cgi");
		input_last_name		.val(medical_record.___last_name)
							.attr("data-db_value", medical_record.___last_name)
							.attr("data-script", "doctor.cgi");
		input_middle_name	.val(medical_record.___middle_name)
							.attr("data-db_value", medical_record.___middle_name)
							.attr("data-script", "doctor.cgi");
		input_birthdate		.val(medical_record.___birthdate)
							.attr("data-db_value", medical_record.___birthdate)
							.attr("data-script", "doctor.cgi");

		row			 		.attr("data-id", medical_record.id);
		open_button 		.attr("data-id", medical_record.id);
		input_first_name	.attr("data-id", medical_record.id);
		input_middle_name	.attr("data-id", medical_record.id);
		input_last_name		.attr("data-id", medical_record.id);
		input_birthdate		.attr("data-id", medical_record.id);
		edit_button			.attr("data-id", medical_record.id);
		remove_button		.attr("data-id", medical_record.id);

		input_first_name	.attr("data-action", "AJAX_updatePatientFirstName");
		input_middle_name	.attr("data-action", "AJAX_updatePatientMiddleName");
		input_last_name		.attr("data-action", "AJAX_updatePatientLastName");
		input_birthdate		.attr("data-action", "AJAX_updatePatientBirthdate");
		edit_button			.attr("data-action", "AJAX_deletePatient");
		remove_button		.attr("data-action", "AJAX_deletePatient");

		open_button			.on("click",  TriggerCollapsible_ClickHandler);
		input_first_name	.on("change", system_calls.UpdateInputFieldOnServer);
		input_middle_name	.on("change", system_calls.UpdateInputFieldOnServer);
		input_last_name		.on("change", system_calls.UpdateInputFieldOnServer);
		input_birthdate		.on("change", system_calls.UpdateInputFieldOnServer);
		// edit_button			.on("click",  EditPatient_ClickHandler);
		remove_button		.on("click",  RemovePatient_AreYouSure_ClickHandler);

		open_col			.append(open_button);
		first_name_col		.append(input_first_name);		if(isMe) first_name_col	.append($("<label>"));
		last_name_col		.append(input_last_name);		if(isMe) last_name_col	.append($("<label>"));
		middle_name_col		.append(input_middle_name);		if(isMe) middle_name_col.append($("<label>"));
		birthdate_col		.append(input_birthdate);		if(isMe) birthdate_col	.append($("<label>"));
		edit_col			.append(edit_button);
		remove_col			.append(remove_button);

		if(isMe) {} 
		else
		{
			remove_button.hide();
			edit_button.hide();
		}

		row
			.append(open_col)
			.append(last_name_col).append(first_name_col).append(middle_name_col).append(birthdate_col)
			.append(edit_col).append(remove_col);

		result = result.add(row);
		result = result.add(row_collapsible);

		return	result;
	};

	var	GetMedicalRecords_DOM = function(medical_records)
	{
		let	result = $();

		medical_records.forEach(function(item)
		{
			result = result.add(GetMedicalRecord_DOM(item));
		});

		return result;
	};

	var	RenderMedicalRecords = function(medical_records)
	{
		$("#medical_record_list").empty().append(GetMedicalRecords_DOM(medical_records));
	};

	var	TriggerCollapsible_ClickHandler = function(e)
	{
		var		collapsible_tag_id = $(this).attr("data-target");
		$("#" + collapsible_tag_id).collapse("toggle");
	};

	var	RemovePatient_AreYouSure_ClickHandler = function(e)
	{
		var		curr_tag = $(this);

		$("#AreYouSureRemovePatient .submit").attr("data-id", curr_tag.attr("data-id"));
		$("#AreYouSureRemovePatient .submit").attr("data-action", curr_tag.attr("data-action"));
		$("#AreYouSureRemovePatient").modal("show");
	};

	var	ConfirmPatientRemove_ClickHandler = function()
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
					$("#AreYouSureRemovePatient").modal("hide");
					setTimeout(function() { $("#collapsible_med_record_" + id).collapse("hide"); } , 100);
					setTimeout(function() { $(".row.med_record[data-id=\"" + id + "\"]").hide(300); } , 300);
					setTimeout(function() { $(".row.med_record[data-id=\"" + id + "\"]").remove(); } , 1000);
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

	var	DisplayFilter_ChangeHandler = function(e) {
		let filter = e.target.value;

		$("[status-all]").hide();
		$(`[status-${filter}]`).show(750);
	};

	return {
		Init: Init
	};

})();
