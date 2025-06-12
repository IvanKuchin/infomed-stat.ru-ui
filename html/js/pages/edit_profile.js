var	edit_profile = edit_profile || {};

edit_profile = (function()
{
'use strict';

var		MAX_NUMBER_PREVIEW = 3;
var		DATE_FORMAT_GLOBAL = "dd/mm/yy";

var		JSON_AvatarList;  // --- must be global to get access from ShowActiveAvatar
var		userProfile;
var		datepickerDateFormat;

var	Init = function()
{
	var		user_tag = $("#myUserID");

	GetUserProfileFromServer();

	$("#AreYouSure #Remove").on("click", AreYouSureRemove_ClickHandler);

	// --- change password
	$("#changePassword1").on("keyup", ChangePassword1_KeyupHandler);
	$("#changePassword2").on("keyup", ChangePassword2_KeyupHandler);

	$("#changePassword").on("click", ChangePassword);

	$("#submitChangeEmail").on("click", ChangeEmail_ClickHandler);
	$("#submitChangeLogin").on("click", ChangeLoginOnServer_ClickHandler);

	$("#DeleteAvatarDialogBox").dialog({
		autoOpen: false,
		modal: true,
		show: {effect: "drop", duration: 300, direction: "up"},
		hide: {effect: "drop", duration: 200, direction: "down"},
		buttons : {
			"Удалить" : function() {
				console.debug("ShowPreviewAvatar: deletion dialog: delete preview AJAX_deleteAvatar?id="+$(this).dialog("option", "id"));

				$(this).dialog("close");

				DeletePreviewAvatar($(this).dialog("option", "id"));

			},
			"Отмена" : function() {
				$(this).dialog("close");
			}
		}
	});

	$("#DeleteAvatarDialogBoxBS_Submit").on("click", function() {
		console.debug("removed avatar id " + $("#DeletedAvatarID_InBSForm").val());

		$("#DeleteAvatarDialogBoxBS").modal("hide");

		// --- Real avatar deletion after closing dialog to improve User Experience
		DeletePreviewAvatar($("#DeletedAvatarID_InBSForm").val());
	});

	// --- Image uploader
	$(function () {
		// Change this to the location of your server-side upload handler:
		$('#fileupload').fileupload({
			url: '/cgi-bin/avataruploader.cgi',
			dataType: 'json',
			maxFileSize: 30 * 1024 * 1024,
			acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,


			done: function (e, data) {

				$.each(data.result, function(index, value)
					{
						if(value.result == "error")
						{
							console.debug("fileupload: done handler: ERROR uploading file [" + value.fileName + "] error code [" + value.textStatus + "]");
							if(value.textStatus == "wrong format")
							{
								$("#UploadAvatarErrorBS_ImageName").text(value.fileName);
								$("#UploadAvatarErrorBS").modal("show");
							}
						}

						if(value.result == "success")
						{
							console.debug("fileupload: done handler: uploading success [" + value.fileName + "]");
							edit_profile.DrawAllAvatars();
						}
					});

			},
			progressall: function (e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$('#progress .progress-bar').css(
					'width',
					progress + '%'
				);
			},
			fail: function (e, data) {
				alert("ошибка загрузки фаила: " + data.textStatus);
			}

		}).prop('disabled', !$.support.fileInput)
			.parent().addClass($.support.fileInput ? undefined : 'disabled');
	});

	$("#canvasForAvatar").on("click", function(e) 
										{ 
											if(JSON_AvatarList.length < 3)
											{
												$("#fileupload").click(); 
											}
											else
											{
												system_calls.PopoverError($(this), "Уже загружено 3-и аватарки.");
											}
										});
/*
	// --- phone confirmation
	$("#submitConfirmPhoneNumber").on('click', PhoneConfirmation_ClickHandler);
	$("#DialogPhoneConfirmation").on("shown.bs.modal", PhoneConfirmationCode_ShownHandler);
	$(".__user-account-confirmation-code").on("input", PhoneConfirmationCode_InputHandler);
*/
	// --- sms login block
	sms_confirmation.SetCountryCodeSelector	("#country_code");
	sms_confirmation.SetPhoneNumberSelector	("#phone_number");
	sms_confirmation.SetTriggerSelector		("#submitConfirmPhoneNumber");
	sms_confirmation.SetSuccessCallback		(function(param) { system_calls.PopoverInfo($("#submitConfirmPhoneNumber"), "Телефон подтвержден"); });
	sms_confirmation.SetFailCallback		(function(param) { system_calls.PopoverInfo($("#submitConfirmPhoneNumber"), "Телефон НЕ подтвержден"); });
	sms_confirmation.SetScript1				("account.cgi");
	sms_confirmation.SetAction1				("AJAX_sendPhoneConfirmationSMS");
	sms_confirmation.SetScript2				("account.cgi");
	sms_confirmation.SetAction2				("AJAX_confirmPhoneNumber");

	ScrollToElementID("#" + system_calls.GetParamFromURL("scrollto"));
};

var	GetUserProfileFromServer = function()
{
	$.getJSON('/cgi-bin/index.cgi?action=JSON_getUserProfile', {param1: "_"})
		.done(function(data) {
			if(data.result === "success")
			{
				userProfile = data.users[0];
				DrawAllAvatars();
				RenderUserName();
				RenderPhone();
				RenderUserSex();
				RenderUserBirthday();
				RenderUserEmail();
				RenderUserLogin();
			}
			else
			{
				console.error(data.description);
			}
		})
		.fail(function() 
		{
			console.error("error parse JSON response");
		});
};

var	ScrollToElementID = function(elementID)
{
	if((elementID.length > 1) && $(elementID).length) // --- elementID is "#XXXX"
		system_calls.ScrollWindowToElementID(elementID);
};

var	UpdateUserSex = function(userSex)
{
	$.getJSON('/cgi-bin/account.cgi?action=AJAX_changeUserSex', {userSex: userSex})
		.done(function(data) {
			if(data.result === "success")
			{
			}
			else
			{
				console.debug("UpdateUserSex: ERROR: " + data.description);
			}
		});
};

var	RenderUserSex = function()
{
	var		result = $();
	var		currentEmploymentText = "";
	var		elementID;

	if(typeof(userProfile) == "undefined")
	{
		return;
	}

	if(userProfile.userSex == "male") elementID = "#sexMale";
	if(userProfile.userSex == "female") elementID = "#sexFemale";

	$(elementID).prop("checked", true);

	$("input#sexMale").on("click", function() { UpdateUserSex("male"); });
	$("input#sexFemale").on("click", function () { UpdateUserSex("female"); });

};

var	RenderUserBirthday = function()
{
	var	temp_date;
	var	birthday_input_value = "";
	var	birthday = new Date();

	if(userProfile.birthday.length)
	{
		temp_date = userProfile.birthday.split('-');
		if(temp_date.length == 3)
		{
			birthday = new Date(parseInt(temp_date[0]), parseInt(temp_date[1]) - 1, parseInt(temp_date[2]));
			birthday_input_value = system_calls.GetFormattedDateFromSeconds(birthday.getTime()/1000, "DD/MM/YYYY");
		}
		else
		{
			console.error("fail with date format(" + userProfile.birthday + ") must be YYYY-MM-DD");
		}
	}

	$(".birthday")
		.on("change", system_calls.UpdateInputFieldOnServer)
		.attr("data-db_value", birthday_input_value)
		.val(birthday_input_value)
		.datepicker({
		      dateFormat: DATE_FORMAT_GLOBAL,
		      showOtherMonths: true,
		      selectOtherMonths: true
		});
};

var	RenderPhone = function()
{
	$("#country_code").val(userProfile.country_code);
	$("#phone_number").val(userProfile.phone);
};

var	RenderUserName = function()
{
	$("#first_name_ru")
		.on("change", system_calls.UpdateInputFieldOnServer)
		.attr("data-db_value", userProfile.name_first)
		.val(userProfile.name_first);

	$("#last_name_ru")
		.on("change", system_calls.UpdateInputFieldOnServer)
		.attr("data-db_value", userProfile.name_last)
		.val(userProfile.name_last);

	$("#middle_name_ru")
		.on("change", system_calls.UpdateInputFieldOnServer)
		.attr("data-db_value", userProfile.name_middle)
		.val(userProfile.name_middle);
};

var	RenderUserLogin = function()
{
	$("#changeLogin").val(userProfile.login);
};

var	RenderUserEmail = function()
{
	$("#changeEmail").val(userProfile.email);

	if(userProfile.email_changeable == "Y")
	{
		$("#changeEmail").removeAttr("disabled");
		$("#submitChangeEmail").removeAttr("disabled");
	}
	else
	{
		$("#changeEmail").attr("disabled", "disabled");
		$("#submitChangeEmail").attr("disabled", "disabled");
	}
};

var DrawTextAvatar = function(context, size)
{
	var	ctx = document.getElementById(context).getContext("2d");

	ctx.clearRect(0,0,size,size);

	ctx.beginPath();
	ctx.arc(size/2,size/2, size/2, 0,2*Math.PI);
	ctx.closePath();
	ctx.fillStyle = "grey";
	ctx.fill();

	ctx.font = "normal "+size*3/8+"pt Calibri";
	ctx.textAlign = "center";
	ctx.fillStyle = "white";
	ctx.fillText(system_calls.GetUserInitials(userProfile.name_first, userProfile.name_last), size/2,size*21/32);
};

var	DeletePreviewAvatar = function (id)
{
	$.ajax({
		url:"/cgi-bin/index.cgi",
		data: {action:"AJAX_deleteAvatar", id:id, value:""}
	}).done(DrawAllAvatars);
};

	var ShowPreviewAvatar = function (context, image, isActive, id)
	{

		var DrawBigAvatar = function()
		{
			var		ctxMain = document.getElementById("canvasForAvatar").getContext("2d");
			var 	x1 = 0, x2 = 150, y1 = 0, y2 = 150, radius = 10;
			var		sMinEdge = Math.min(pic.width, pic.height);

			// console.debug("DrawBigAvatar: click handler event [entryID="+id+"]");

			ctxMain.clearRect(0,0,150,150);
			ctxMain.save();
			ctxMain.beginPath();
			ctxMain.moveTo(radius, 0);
			ctxMain.lineTo(x2 - radius, 0);
			ctxMain.quadraticCurveTo(x2,0, x2,radius);
			ctxMain.lineTo(x2, y2 - radius);
			ctxMain.quadraticCurveTo(x2,y2, x2-radius,y2);
			ctxMain.lineTo(radius, y2);
			ctxMain.quadraticCurveTo(0,y2, 0,y2-radius);
			ctxMain.lineTo(0, radius);
			ctxMain.quadraticCurveTo(0,0, radius,0);
			ctxMain.clip();

			ctxMain.drawImage(pic, (pic.width - sMinEdge) / 2, (pic.height - sMinEdge) / 2, sMinEdge, sMinEdge, 0,0,150,150);
			ctxMain.restore();
		};

		var	ctx = document.getElementById(context).getContext("2d");
		var pic = new Image();

		if(context == "canvasForAvatarPreview0")
		{
			// --- Generation avatar text preview
			DrawTextAvatar(context, 20);

			// --- Hide "delete" cross due to delete text avatar impossible
			$("#canvasForAvatarPreview0_del").hide();

			document.getElementById(context+"_overlay").addEventListener('click', function()
				{
					// --- mark all preview inactive
					JSON_AvatarList.forEach(function(item)
											{
												item.isActive = "0";
											});

					DrawTextAvatar("canvasForAvatar", 150);

					$.ajax({
						url:"/cgi-bin/index.cgi",
						data: {action:"AJAX_updateActiveAvatar", id:"-1", value:""}
					}).done();

				}
			);
			if(isActive == 1) { DrawTextAvatar("canvasForAvatar", 150); }
		}
		else
		{

			pic.src = image;
			pic.onload = function ()
			{
				var		sMinEdge = Math.min(pic.width, pic.height);


				// console.debug("ShowPreviewAvatar("+context+","+image+"): onLoad handler event [entryID="+id+"]");
				ctx.drawImage(this, (pic.width - sMinEdge) / 2, (pic.height - sMinEdge) / 2, sMinEdge, sMinEdge,0,0,20,20);
				if(id > 0)
				{

					document.getElementById(context+"_overlay").addEventListener('click', function()
					{
						// --- mark clicked preview active
						JSON_AvatarList.forEach(function(item)
												{
													item.isActive = "0";
													if(item.avatarID == id)
													{
														item.isActive = "1";
													}
												});
						DrawBigAvatar();

						$.ajax({
							url:"/cgi-bin/index.cgi",
							data: {action:"AJAX_updateActiveAvatar", id:id, value:""}
						}).done(function() {});
					});

					document.getElementById(context+"_del").addEventListener('click', function()
					{
						// $("#DeleteAvatarDialogBox").dialog("option", "id", id);
						// $("#DeleteAvatarDialogBox").dialog("open");

						$("#DeletedAvatarID_InBSForm").val(id);
						$("#DeleteAvatarDialogBoxBS").modal("show");


					});

					if(isActive == 1) { DrawBigAvatar(); }
				}

			};
		}
	};

	var filterInactiveAvatars = function(item)
	{
		if (item.isActive == "1")
		{
			return true;
		}
		return false;
	};

	var ShowActiveAvatar = function()
	{
		if(JSON_AvatarList.filter(filterInactiveAvatars).length === 0)
		{
			DrawTextAvatar("canvasForAvatar", 150);
		}
		DrawTextAvatar("canvasForAvatarPreview0", 20);
	};

	var DrawAllAvatars = function()
	{
	// --- AJAX avatar list download
	$.getJSON('/cgi-bin/index.cgi?action=JSON_getAvatarList', {param1: ''})
		.done(function(data) {
			var		i;

			JSON_AvatarList = data;

			ShowActiveAvatar();

			i = 0;
			ShowPreviewAvatar("canvasForAvatarPreview" + i++, "");
			JSON_AvatarList.forEach
				(function (entry)
					{
						if(i <= MAX_NUMBER_PREVIEW)
						{
							ShowPreviewAvatar("canvasForAvatarPreview" + i++, "/images/avatars/avatars" + entry.folder + "/" + entry.filename, entry.isActive, entry.avatarID);
						}
					}
				);
			if(i < 4)
			{
				for(;i < 4; i++)
				{
					ShowPreviewAvatar("canvasForAvatarPreview" + i, "/images/pages/edit_profile/cloud_arrow.jpg", 0 /*entry.isActive*/, -2/*entry.avatarID*/);
				}
				$("#fileupload").attr("disabled", false);
				$("#spanForFileUploadButton").addClass("btn-success");
				$("#spanForFileUploadButton").removeClass("btn-default");
			}
			else
			{
				$("#fileupload").attr("disabled", true);
				$("#spanForFileUploadButton").addClass("btn-default");
				$("#spanForFileUploadButton").removeClass("btn-success");

			}
		});
	};

	var	AreYouSureRemove_ClickHandler = function() {
		var		affectedID = $("#AreYouSure #Remove").data("id");
		var		affectedAction = $("#AreYouSure #Remove").data("action");
		var		affectedScript = $("#AreYouSure #Remove").data("script");

		if(typeof(affectedScript) == "undefined") affectedScript = "";
		if(!affectedScript.length) affectedScript = "index.cgi";
		$("#AreYouSure").modal('hide');

		$.getJSON('/cgi-bin/' + affectedScript + '?action=' + affectedAction, {id: affectedID})
			.done(function(data) {
				if(data.result === "success")
				{
				}
				else
				{
					console.error("ERROR: " + data.description);
				}
			});

		// --- update GUI has to be inside getJSON->done->if(success).
		// --- To improve User Experience (react on user actions immediately)
		// ---	 I'm updating GUI immediately after click, not waiting server response
		if((affectedAction == "AJAX_deleteAirlineBonusNumber") && affectedID)		$("#avia_bonus_list .__program_id_" + affectedID).hide(250);
		if((affectedAction == "AJAX_deleteHotelchainBonusNumber") && affectedID)	$("#hotelchain_bonus_list .__program_id_" + affectedID).hide(250);
		if((affectedAction == "AJAX_deleteRailroadBonusNumber") && affectedID)		$("#railroad_bonus_list .__program_id_" + affectedID).hide(250);

	};

	var	ErrorModal = function(errorMessage)
	{
		$("#ErrorModal_ResultText").empty().append(errorMessage);
		$("#ErrorModal").modal("show");
	};

/*
	// --- phone part
	var	GetOnlyDigits = function(param)
	{
		return param.replace(/\D/g, '');
	};

	var PhoneConfirmation_ClickHandler = function(event)
	{
		var		curr_tag = $(this);
		var		country_code = GetOnlyDigits($( "#country_code option:selected" ).val());
		var		phone_number = GetOnlyDigits($( "#phone_number" ).val());

		if(country_code.length)
		{
			if(phone_number.length)
			{
				$("#DialogPhoneConfirmation").modal("show");
				SendPhoneConfirmationSMS();
			}
			else
			{
				system_calls.PopoverError(curr_tag, "Номер телефона должен содержать цифры");
			}
		}
		else
		{
			system_calls.PopoverError(curr_tag, "Код страны должен содержать цифры");
		}

	};

	var	SendPhoneConfirmationSMS = function()
	{
		var	country_code = $("#country_code").val();
		var	phone_number = $("#phone_number").val();

		PhoneConfirmationCode_Status("отправляется СМС ...", "");
		
		$.getJSON('/cgi-bin/account.cgi?action=AJAX_sendPhoneConfirmationSMS', {country_code: country_code, phone_number: phone_number})
		.done(
			function(data) 
			{
				if(data.result == "success")
				{
					// --- nothing to do, just wait
					PhoneConfirmationCode_Status("СМС доставлено.", "color_green");
				}
				else
				{
					// --- Fail to block the account
					PhoneConfirmationCode_Status("ошибка доставки СМС.", "color_red");
					system_calls.PopoverError($("#ButtonAccountCancel2"), data.description);


				} // --- if(data.status == "success")
			})
		.fail(
			function(data) 
			{
				// --- Fail to block the account
				$("#phone_confirmation_status")
					.empty()
					.removeAttr("class")
					.addClass("color_red")
					.append("ошибка доставки СМС.");

				system_calls.PopoverError($("#ButtonAccountCancel2"), "ошибка доставки СМС");
			});
	};

	var	InitPhoneConfirmation = function()
	{
		$(".__user-account-confirmation-code").val("");
		$(".__user-account-confirmation-code:eq(0)").focus();
	};
		
	var	PhoneConfirmationCode_ShownHandler = function()
	{
		InitPhoneConfirmation();
	};

	var	PhoneConfirmationCode_Status = function(message, class_name)
	{
		$("#phone_confirmation_status")
			.empty()
			.removeAttr("class")
			.addClass(class_name)
			.append(message);
	};

	var	PhoneConfirmationCode_InputHandler = function(e)
	{
		var	curr_tag = $(this);
		var	curr_value = curr_tag.val();
		var	curr_order = curr_tag.attr("data-order");
		var	next_tag;
		var	confirmation_code;

		if(curr_value.length > 1)
		{
			console.error("value in input field longer than allowed");
			curr_value = curr_value[0];
			curr_tag.val(curr_value);
		}

		if(curr_value.length)
		{
			if((curr_value >= "0") && (curr_value <= "9"))
			{
				if(curr_order == "3")
				{
					confirmation_code = 
						curr_tag.parent().parent().find("input:eq(0)").val() + 
						curr_tag.parent().parent().find("input:eq(1)").val() + 
						curr_tag.parent().parent().find("input:eq(2)").val() + 
						curr_tag.parent().parent().find("input:eq(3)").val();

					CheckConfirmationCodeValidity(confirmation_code);
				}
				else
				{
					next_tag = curr_tag.parent().parent().find("input:eq(" + (parseInt(curr_order) + 1) + ")");
					next_tag.val("").focus();
				}
			}
			else
			{
				system_calls.PopoverError(curr_tag, "Введите цифру");
				curr_tag.val("");
			}
		}

	};

	var CheckConfirmationCodeValidity = function(confirmation_code)
	{
		if(confirmation_code.length == 4)
		{
			$.getJSON('/cgi-bin/account.cgi?action=AJAX_checkPhoneConfirmationCode', {confirmation_code: confirmation_code})
			.done(
				function(data) 
				{
					if(data.result == "success")
					{
						PhoneConfirmationCode_Final("Телефон подтвержден");
					}
					else
					{
						// --- Fail to block the account
						PhoneConfirmationCode_Status(data.description, "color_red");
						InitPhoneConfirmation();
						if((typeof(data.attempt) != "undefined") && (parseInt(data.attempt) >= "3"))
						{
							PhoneConfirmationCode_Final("Телефон НЕ подтвержден");
						}
					} // --- if(data.status == "success")
				})
			.fail(
				function(data) 
				{
					// --- Fail to block the account
					PhoneConfirmationCode_Status("Ошибка ответа сервера", "color_red");
					system_calls.PopoverError("Ошибка ответа сервера");
				});

		}
		else
		{
			system_calls.PopoverError($(".__user-account-confirmation-code"), "Необходимо ввести 4-ре цифры");
			InitPhoneConfirmation();
		}
	};

	var	PhoneConfirmationCode_Final = function(message)
	{
		$("#DialogPhoneConfirmation").modal("hide");
		system_calls.PopoverInfo($("#submitConfirmPhoneNumber"), message);
	};
*/

	var	ChangeEmail_ClickHandler = function()
	{
		let curr_tag = $(this);
		let new_email = $("#changeEmail").val();


		if(new_email.length)
		{
			curr_tag.button("loading");
			
			$.getJSON('/cgi-bin/account.cgi?action=AJAX_changeEmail', {login: new_email})
			.done(
				function(data) 
				{
					if(data.result == "success")
					{
						$("#EmailChangeDialog").modal("show");
					}
					else
					{
						// --- Fail to block the account
						system_calls.PopoverError(curr_tag, data.description);
					} // --- if(data.status == "success")
				})
			.fail(
				function(data) 
				{
					// --- Fail to block the account
					system_calls.PopoverError(curr_tag, "Ошибка ответа сервера");
				})
			.always(
				function(data)
				{
					curr_tag.button("reset");
				});
		}
		else
		{
			system_calls.PopoverError(curr_tag, "email не может быть пустым");
		}

	};

	var	ChangeLoginOnServer_ClickHandler = function()
	{
		var		newLogin = $("#changeLogin").val();

		if(newLogin.length >= 8)
		{
			if((newLogin.indexOf("/") == -1) && (newLogin.indexOf("\\") == -1))
			{

				$("#submitChangeLogin").button("loading");
						
				$.getJSON('/cgi-bin/account.cgi?action=AJAX_changeLogin', {login: newLogin})
				.done(
					function(data) 
					{
						$("#submitChangeLogin").button("reset");
						
						if(data.result == "success")
						{
							// --- Success account blocking 
							system_calls.PopoverInfo("changeLogin", "Логин обновлен");
						}
						else
						{
							// --- Fail to block the account
							console.debug("error in login changing [" + data.description + "]");
							system_calls.PopoverError("changeLogin", data.description);
						} // --- if(data.status == "success")
					})
				.fail(
					function(data) 
					{
						$("#submitChangeLogin").button("reset");
						// --- Fail to block the account
						console.debug("error in login changing [" + data.description + "]");
						system_calls.PopoverError("changeLogin", "Ошибка ответа сервера");
					});


			}
			else
			{
				system_calls.PopoverError("changeLogin", "Нельзя использовать сивол /");
			}
		}
		else
		{
			system_calls.PopoverError("changeLogin", "Должен быть 8 и более символов.");
		}
	};

	var ChangePassword = function()
	{
		var		password1  = $("#changePassword1").val();
		var		password2  = $("#changePassword2").val();
		var		shaObj;
		var		password_hash;

		console.debug("ChangePassword: start");

		$("#changePassword1").popover("destroy");
		$("#changePassword2").popover("destroy");

		if(password1 === "") 
		{
			console.debug("ChangePassword: ERROR: changePassword1 is empty");

			$("#changePassword1").popover({"content": "Пароль не должен быть пустым."})
								.popover("show");
			setTimeout(function () 
				{
					$("#changePassword1").popover("destroy");
				}, 3000);
		}
		else
		{
			
			if(password2 === "") 
			{
				console.debug("ChangePassword: ERROR: changePassword2 is empty");

				$("#changePassword2").popover({"content": "Пароль не должен быть пустым."})
									.popover("show");
				setTimeout(function () 
					{
						$("#changePassword2").popover("destroy");
					}, 3000);
			}
			else
			{
				
				if(password1 != password2)
				{
					console.debug("ChangePassword: ERROR: change Password1 != changePassword2");

					PopoverOnChangePasswords("Пароли не совпадают");
				} // --- if(password1 != password2)
				else
				{
					if(password1.trim() != password1)
					{
							console.debug("ChangePassword: ERROR: password is started/ended with spaces");

							PopoverOnChangePasswords("Пароли НЕ должны начинаться или заканчиваться пробелом");
					}
					else
					{
						if((password1.indexOf("\"") >= 0) || (password1.indexOf("\n") >= 0) || (password1.indexOf("\r") >= 0) || (password1.indexOf("\t") >= 0) || (password1.indexOf("`") >= 0) || (password1.indexOf("'") >= 0) || (password1.indexOf("<") >= 0) || (password1.indexOf(">") >= 0))
						{
							console.debug("ChangePassword: ERROR: password is having special symbols");

							PopoverOnChangePasswords("Пароли НЕ должны содержать символов [\"\'\`<>]");
						}
						else
						{
							shaObj = new jsSHA("SHA-512", "TEXT");
							shaObj.update(password1);
							password_hash = shaObj.getHash("HEX");

							$.getJSON('/cgi-bin/index.cgi?action=AJAX_changeUserPassword', {password: password_hash})
							.done(
								function(data) 
								{
									if(data.result == "success")
									{
										// --- Success account blocking 
										console.debug("BlockAccount: password changed");

										$("#PasswordChanged").modal("show");
									}
									else
									{
										// --- Fail to block the account
										console.debug("BlockAccount: error in password changing [" + data.description + "]");

										PopoverOnChangePasswords(data.description);


									} // --- if(data.status == "success")
								});
						} // --- if(special symbols exists)
					} // --- if(pass.trim() != pass)
				} // --- if(password1 != password2)
			} // --- if(password2 === "")
		} // --- if(password1 === "")

		console.debug("ChangePassword: stop");
	};

	var InputPasswordCleanUP = function(event)
	{
		var		divChangePassword1 = $("#changePassword1").parent();
		var		divChangePassword2 = $("#changePassword2").parent();
		var		buttonChangePassword1 = $("#changePassword1");
		var		buttonChangePassword2 = $("#changePassword2");
		var		spanChangePassword1 = $("#changePassword1").siblings();
		var		spanChangePassword2 = $("#changePassword2").siblings();

		divChangePassword1.removeClass("has-success has-error");
		divChangePassword2.removeClass("has-success has-error");
		spanChangePassword1.removeClass("glyphicon-ok glyphicon-remove")
							.addClass("user-account-properties-hidden");
		spanChangePassword2.removeClass("glyphicon-ok glyphicon-remove")
							.addClass("user-account-properties-hidden");
	};

	var ChangePassword1_KeyupHandler = function(event)
	{
		var		keyPressed = event.keyCode;

		console.debug("ChangePassword1_KeyupHandler: start keyPressed [" + keyPressed + "] value = " + $("#changePassword1").val());

		if($("#changePassword2").val().length)
		{
			var		divChangePassword1 = $("#changePassword1").parent();
			var		divChangePassword2 = $("#changePassword2").parent();
			var		buttonChangePassword1 = $("#changePassword1");
			var		buttonChangePassword2 = $("#changePassword2");
			var		spanChangePassword1 = $("#changePassword1").siblings();
			var		spanChangePassword2 = $("#changePassword2").siblings();

			InputPasswordCleanUP();

			if($("#changePassword1").val() === $("#changePassword2").val())
			{
				divChangePassword1.addClass("has-success");
				spanChangePassword1.removeClass("user-account-properties-hidden").addClass("glyphicon-ok");
			}
			else
			{
				divChangePassword1.addClass("has-error");
				spanChangePassword1.removeClass("user-account-properties-hidden").addClass("glyphicon-remove");
			}
		}

		console.debug("ChangePassword1_KeyupHandler: stop");
	};

	var ChangePassword2_KeyupHandler = function(event)
	{
		var		keyPressed = event.keyCode;

		console.debug("ChangePassword1_KeyupHandler: start keyPressed [" + keyPressed + "] value = " + $("#changePassword2").val());

		if($("#changePassword2").val().length)
		{
			var		divChangePassword1 = $("#changePassword1").parent();
			var		divChangePassword2 = $("#changePassword2").parent();
			var		buttonChangePassword1 = $("#changePassword1");
			var		buttonChangePassword2 = $("#changePassword2");
			var		spanChangePassword1 = $("#changePassword1").siblings();
			var		spanChangePassword2 = $("#changePassword2").siblings();

			InputPasswordCleanUP();

			if($("#changePassword1").val() === $("#changePassword2").val())
			{
				divChangePassword2.addClass("has-success");
				spanChangePassword2.removeClass("user-account-properties-hidden").addClass("glyphicon-ok");
			}
			else
			{
				divChangePassword2.addClass("has-error");
				spanChangePassword2.removeClass("user-account-properties-hidden").addClass("glyphicon-remove");
			}
		}

		console.debug("ChangePassword1_KeyupHandler: stop");
	};

	var PopoverOnChangePasswords = function(message)
	{
		$("#changePassword2").popover({"content": message})
							.popover("show");
		$("#changePassword1").popover({"content": message})
							.popover("show");

		setTimeout(function () 
			{
				$("#changePassword1").popover("destroy");
				$("#changePassword2").popover("destroy");
			}, 3000);

	};

	return {
		Init: Init,
		DrawAllAvatars: DrawAllAvatars,
		userProfile: userProfile,
	};

})();
