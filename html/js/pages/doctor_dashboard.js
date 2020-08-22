
var	doctor_dashboard = doctor_dashboard || {};

var	doctor_dashboard = (function()
{
	'use strict';

	var	data_global;

	var	Init = function()
	{
		$.ajaxSetup({ cache: false });

		// --- this is required such as this is entry page and session persistency should be saved
		if(session_pi.isCookieAndLocalStorageValid())
		{
			GetInitialData();
		}
		else
		{
			window.location.href = "/autologin?rand=" + Math.random() * 1234567890;
		}

		$("#FirstName_LastName_Modal .submit").on("click", function() { window.location.href = "/cgi-bin/doctor.cgi?action=edit_profile_template&rand=" + Math.random() * 865678906; });
		$("#Email_Modal .submit").on("click", function() { window.location.href = "/cgi-bin/doctor.cgi?action=edit_profile_template&rand=" + Math.random() * 865678906; });
	};

	var	GetInitialData = function()
	{
		var		currTag = $("#dashboard");


		$.getJSON(
			'/cgi-bin/doctor.cgi',
			{
				"action":"AJAX_getDashboardData",
			})
			.done(function(data)
			{
				if(data.result == "success")
				{
					data_global = data;

					RenderRejectedTimecards();
					CheckUserData(data.users[0]);
				}
				else
				{
					system_calls.PopoverError(currTag.attr("id"), "Ошибка: " + data.description);
				}
			})
			.fail(function(data)
			{
				setTimeout(function() {
					system_calls.PopoverError(currTag.attr("id"), "Ошибка ответа сервера");
				}, 500);
			});
	};

	var	RenderRejectedTimecards = function()
	{
		var		currTag = $("#number_of_medical_records");
		var		med_record_dom;
		var		med_record_tooltip_content = "";
		var		new_dom = $();

		med_record_dom = $("<strong>")
						.append(data_global.number_of_medical_records)
						.addClass("h2 cursor_pointer")
						.addClass(med_record_tooltip_content.length ? "color_red" : "color_green")
						.attr("data-toggle", "tooltip")
						.attr("data-html", "true")
						.attr("data-placement", "top")
						.attr("title", med_record_tooltip_content)
						.on("click", function(e) { window.location.href = "/cgi-bin/doctor.cgi?action=medical_record_list_template&rand=" + Math.random() * 35987654678923; });

		med_record_dom.tooltip({ animation: "animated bounceIn"});

		new_dom = new_dom
					.add(med_record_dom);

		currTag.empty().append(new_dom);
	};

	var	CheckUserData = function(user)
	{
		if((user.name_first.length === 0) || (user.name_last.length === 0))
		{
			if(Math.trunc(Math.random() * 5) == 0)
			{
				$("#FirstName_LastName_Modal").modal("show");
			}
		}
		else if((user.email.length === 0))
		{
			if(Math.trunc(Math.random() * 10) == 0)
			{
				$("#Email_Modal").modal("show");
			}
		}

	};

	return {
		Init: Init
	};

})();
