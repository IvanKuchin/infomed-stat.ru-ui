/*exported medical_record_add*/
/*globals medical_record_add:off*/

var medical_record_add = (function () {
	"use strict";

	var DATE_FORMAT_GLOBAL = "yy-mm-dd";

	var current_tab_global = 0;
	var patient_could_be_created_or_updated_global = false;
	var patient_id_from_url_global = $.urlParam("patient_id");

	var patient_data_global;

	var Init = function () {
		$.ajaxSetup({ cache: false });

		InitWizard();
		BuildStepIndicators(0);

		$("input.___zip_code").on("input", UpdateZipCode_InputHandler);
		$("input.___first_name").on("change", CheckPatientExistence_ChangeHandler);
		$("input.___last_name").on("change", CheckPatientExistence_ChangeHandler);
		$("input.___birthdate").on("change", CheckPatientExistence_ChangeHandler);

		InitPatientID(patient_id_from_url_global);
	};

	var InitPatientID = function (patient_id) {
		if (patient_id.length) {
			$.getJSON(
				"/cgi-bin/doctor.cgi",
				{
					action: "AJAX_getMedicalRecords",
					patient_id: patient_id,
				})
				.done(function (data) {
					if (data.result == "success") {
						patient_data_global = data.medical_records;

						GetTagMedicalObjects_AndAssignUniqDataID();
						PlacePatientDataToForm(patient_data_global);
					}
					else {
						system_calls.PopoverError($("nav").eq(0), "Ошибка: " + data.description);
					}
				})
				.fail(function () {
					setTimeout(function () {
						system_calls.PopoverError($("nav").eq(0), "Ошибка ответа сервера");
					}, 500);
				});
		}
	};

	var InitWizard = function () {
		$("#navigate_prev").on("click", function () { MakeStep($(".__tab[data-tab_id='" + current_tab_global + "']").attr("data-prev_tab_id")); });
		$("#navigate_next").on("click", function () { MakeStep($(".__tab[data-tab_id='" + current_tab_global + "']").attr("data-next_tab_id")); });

		$(".__date_picker")
			.datepicker({
				firstDay: 1,
				dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
				dayNamesMin: ["Вc", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
				monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
				monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
				changeMonth: true,
				changeYear: true,
				defaultDate: "+0d",
				numberOfMonths: 1,
				yearRange: "1940:2030",

				dateFormat: DATE_FORMAT_GLOBAL,
				showOtherMonths: true,
				selectOtherMonths: true
			});


		ResetDataStructureAndGUI();

		ShowTab(current_tab_global);
		ActivateDOMHandlers();
	};

	var ResetDataStructureAndGUI = function () {
		// --- stub function
	};

	var ShowTab = function (tab_id) {
		setTimeout(function () {
			$(".__tab[data-tab_id='" + tab_id + "']").show(200);
		}, 100);

		if (current_tab_global === 0) {
			$("#navigate_next").empty().append("Дальше");
			$("#navigate_prev").hide();
		}
		else {
			$("#navigate_prev").show();
			HighlightStepIndicator(tab_id);
		}

		if ($(".__tab[data-tab_id='" + tab_id + "']").attr("data-next_tab_id") == "-1") {
			$("#navigate_next").empty().append("Оправить");
		}
		else {
			$("#navigate_next").empty().append("Дальше");
		}
	};

	var HideTab = function (tab_id) {
		DimStepIndicator(tab_id);
		$(".__tab[data-tab_id='" + tab_id + "']").hide(100);
	};

	var MakeStep = function (tab_id) {
		var result = false;

		tab_id = parseInt(tab_id);

		if (
			((tab_id > current_tab_global) && (ValidateTab(current_tab_global) === false)) || // validate only forward step
			((tab_id == -1) && (ValidateTab(current_tab_global) === false)) // validate last step as well
		) {
			// --- keep result as false
		}
		else {
			result = true;

			if (tab_id < 0) {
				// --- submit it to server
				Build_CallStack_and_SubmitDataToBackend();
			}
			else {
				HideTab(current_tab_global);
				current_tab_global = tab_id;
				ShowTab(current_tab_global);

				if (current_tab_global === 0) ResetDataStructureAndGUI();
			}

		}

		return result;
	};

	var _isValidDate = function (d_str) {
		let d = new Date(d_str);

		return isNaN(d) ? false : true;
	}

	var _FinalCheck1 = function () {
		let result = false;

		let invasion_str = document.querySelectorAll(".___invasion_date")[0].value;
		let neoadj_chemo_str = "";

		if (document.querySelector("input[type='checkbox'].___neoadj_chemo").checked) {
			neoadj_chemo_str = document.querySelectorAll(".___neoadj_chemo .___start_date")[0].value;
		}

		if (_isValidDate(neoadj_chemo_str) || _isValidDate(invasion_str)) {
			result = true;
		} else {
			system_calls.PopoverError($("#navigate_next"), "Требуется дата операции или дата неоадьювантной химиотерапии");
		}

		return result;
	}

	var _FinalCheck2 = function () {
		let result = false;

		let censor_str = document.querySelectorAll(".___study_retirement_date")[0].value;
		let event_str = document.querySelectorAll(".___death_date")[0].value;

		if (_isValidDate(censor_str) && _isValidDate(event_str)) {
			system_calls.PopoverError($("#navigate_next"), "Выберите либо дату выбытия из исследования, либо дату смерти (обе даты - это ошибка)");
		} else {
			result = true;
		}

		return result;
	}

	var _FinalCheck3 = function () {
		let birthdate_str = document.querySelectorAll(".___birthdate")[0].value;

		let neoadj_chemo_str = document.querySelectorAll(".___neoadj_chemo .___start_date")[0].value;
		let invasion_str = document.querySelectorAll(".___invasion_date")[0].value;

		let relapse_str = document.querySelectorAll(".___relapse_date")[0].value;

		let censor_str = document.querySelectorAll(".___study_retirement_date")[0].value;
		let event_str = document.querySelectorAll(".___death_date")[0].value;

		if (_isValidDate(birthdate_str) && _isValidDate(relapse_str))
			if (new Date(birthdate_str) > new Date(relapse_str)) {
				system_calls.PopoverError($("#navigate_next"), "Дата рецидива не может быть раньше даты рождения");
				return false;
			}

		if (_isValidDate(birthdate_str) && _isValidDate(censor_str))
			if (new Date(birthdate_str) > new Date(censor_str)) {
				system_calls.PopoverError($("#navigate_next"), "Дата выбытия не может быть раньше даты рождения");
				return false;
			}

		if (_isValidDate(birthdate_str) && _isValidDate(event_str))
			if (new Date(birthdate_str) > new Date(event_str)) {
				system_calls.PopoverError($("#navigate_next"), "Дата смерти не может быть раньше даты рождения");
				return false;
			}

		if (_isValidDate(birthdate_str) && _isValidDate(neoadj_chemo_str))
			if (new Date(birthdate_str) > new Date(neoadj_chemo_str)) {
				system_calls.PopoverError($("#navigate_next"), "Дата химиотерапии не может быть раньше даты рождения");
				return false;
			}

		if (_isValidDate(event_str) && _isValidDate(relapse_str))
			if (new Date(event_str) < new Date(relapse_str)) {
				system_calls.PopoverError($("#navigate_next"), "Дата рецидива не может быть позже даты смерти");
				return false;
			}

		if (_isValidDate(censor_str) && _isValidDate(relapse_str))
			if (new Date(censor_str) < new Date(relapse_str)) {
				system_calls.PopoverError($("#navigate_next"), "Дата рецидива не может быть позже даты выбытия из исследования");
				return false;
			}

		if (_isValidDate(birthdate_str) && _isValidDate(invasion_str))
			if (new Date(birthdate_str) > new Date(invasion_str)) {
				system_calls.PopoverError($("#navigate_next"), "Дата операции не может быть раньше даты рождения");
				return false;
			}

		if (_isValidDate(censor_str) && _isValidDate(invasion_str))
			if (new Date(censor_str) < new Date(invasion_str)) {
				system_calls.PopoverError($("#navigate_next"), "Дата операции не может быть позже даты выбытия из исследования");
				return false;
			}

		if (_isValidDate(event_str) && _isValidDate(invasion_str))
			if (new Date(event_str) < new Date(invasion_str)) {
				system_calls.PopoverError($("#navigate_next"), "Дата операции не может быть позже даты смерти");
				return false;
			}

		if (_isValidDate(censor_str) && _isValidDate(neoadj_chemo_str))
			if (new Date(censor_str) < new Date(neoadj_chemo_str)) {
				system_calls.PopoverError($("#navigate_next"), "Дата химиотерапии не может быть позже даты выбытия из исследования");
				return false;
			}

		if (_isValidDate(event_str) && _isValidDate(neoadj_chemo_str))
			if (new Date(event_str) < new Date(neoadj_chemo_str)) {
				system_calls.PopoverError($("#navigate_next"), "Дата химиотерапии не может быть позже даты смерти");
				return false;
			}

		return true;
	}

	var _FinalCheck4 = function () {
		let birthdate_str = document.querySelectorAll(".___birthdate")[0].value;
		let dates = document.querySelectorAll("input[type='date']:not(.___birthdate)");

		for (let i = 0; i < dates.length; i++) {
			let date_str = dates[i].value;

			if (date_str.length && _isValidDate(birthdate_str) && _isValidDate(date_str)) {
				if (new Date(birthdate_str) > new Date(date_str)) {
					let uniq_medical_id = dates[i].getAttribute("data-uniq_medical_id");
					let spelling = common_infomed_stat.GetMedicalItemNameSpelling(uniq_medical_id);
					system_calls.PopoverError($("#navigate_next"), "Дата рождения не может быть позже даты " + spelling);
					return false;
				}
			}
		}

		return true;
	}

	var _FinalCheck5 = function () {
		let death_date = document.querySelectorAll(".___death_date")[0].value;
		let dates = document.querySelectorAll("input[type='date']:not(.___death_date)");

		if (death_date.length > 0 && _isValidDate(death_date)) {
			for (let i = 0; i < dates.length; i++) {
				let date_str = dates[i].value;

				if (date_str.length && _isValidDate(date_str)) {
					if (new Date(date_str) > new Date(death_date)) {
						let uniq_medical_id = dates[i].getAttribute("data-uniq_medical_id");
						let spelling = common_infomed_stat.GetMedicalItemNameSpelling(uniq_medical_id);
						system_calls.PopoverError($("#navigate_next"), "Дата " + spelling + " не может быть позже даты смерти");
						return false;
					}
				}
			}
		}

		return true;
	}

	var ValidateTab = function (tab_id) {
		var result = false;
		var algorithm = $(".__tab[data-tab_id='" + tab_id + "']").attr("data-algorithm");

		if (algorithm) {
			if (algorithm == "personal_data") {
				let first_name_tag = $(".__tab[data-tab_id='" + tab_id + "'] input.___first_name");
				let last_name_tag = $(".__tab[data-tab_id='" + tab_id + "'] input.___last_name");
				let middle_name_tag = $(".__tab[data-tab_id='" + tab_id + "'] input.___middle_name");
				let birthdate = $(".__tab[data-tab_id='" + tab_id + "'] input.___birthdate");

				if (first_name_tag.val() === "") system_calls.PopoverError(first_name_tag, "Заполните имя");
				if (last_name_tag.val() === "") system_calls.PopoverError(last_name_tag, "Заполните фамилию");
				if (middle_name_tag.val() === "") system_calls.PopoverError(middle_name_tag, "Заполните отчество");
				if (birthdate.val() === "") system_calls.PopoverError(birthdate, "Заполните дату рождения");

				if (patient_could_be_created_or_updated_global) result = true;
			}
			else if (algorithm == "eula") {
				if ($("div[data-tab_id='" + tab_id + "'] .eula_acceptance").prop("checked")) {
					result = true;
				}
				else {
					system_calls.PopoverError($("#navigate_next"), "Нужно принять условия лицензионного соглашения");
				}
			}
			else if (algorithm == "neoadjuvant_therapy") {
				if ($(".__tab[data-tab_id='15'] .___neoadj_chemo").prop("checked")) {
					if ($(".__tab[data-tab_id='15'] .___neoadj_chemo input.___start_date").val().length == 0) {
						system_calls.PopoverError($("#navigate_next"), "Укажите дату начала неоадьювантной химиотерапии");
					}
					else if ($(".__tab[data-tab_id='15'] .___neoadj_chemo input.___ca_level_post_chemo").val().length > 8) {
						system_calls.PopoverError($("#navigate_next"), "Уровень CA 15-3 после неоадьювантной химиотерапии (максимум 8 символов)");
					}
					else {
						result = true;
					}
				}
				else {
					result = true; // --- no need to check if not checked
				}
			}
			else if (algorithm == "final_check") {
				if (_FinalCheck1() && _FinalCheck2() && _FinalCheck3() && _FinalCheck4() && _FinalCheck5()) {
					result = true;
				}
			}
			else {
				console.error("unknown algorithm(" + algorithm + ")");
			}
		}
		else {
			// --- if algorithm not defined, nothing to check
			result = true;
		}

		if (result) CompleteStepIndicator(tab_id);

		return result;
	};

	var CheckPatientExistence_ChangeHandler = function () {
		{
			let selectors = ["input.___first_name", "input.___last_name", "input.___middle_name", "input.___birthdate"];
			let first_name_tag = $(selectors[0]);
			let last_name_tag = $(selectors[1]);
			let middle_name_tag = $(selectors[2]);
			let birthdate = $(selectors[3]);
			let curr_tag = $(selectors.join());

			patient_could_be_created_or_updated_global = false;

			if (
				first_name_tag.val().length &&
				last_name_tag.val().length &&
				middle_name_tag.val().length &&
				birthdate.val().length
			) {
				$.post("/cgi-bin/doctor.cgi",
					{
						action: "AJAX_checkPatientExistence",
						___first_name: first_name_tag.val(),
						___last_name: last_name_tag.val(),
						___middle_name: middle_name_tag.val(),
						___birthdate: birthdate.val(),
						patient_id: patient_id_from_url_global,
					})
					.done(function (data) {
						let obj = JSON.parse(data);

						if (obj.result == "success") {
							patient_could_be_created_or_updated_global = true;
						}
						else {
							system_calls.PopoverError(curr_tag, "Ошибка: " + obj.description);
						}
					})
					.fail(function () {
						setTimeout(function () {
							system_calls.PopoverError(curr_tag, "Ошибка ответа сервера");
						}, 100);
					});

			}
		}

	};

	var GetStepIndicators_DOM = function (start_tab_id) {
		var result = $();
		var tab_id = start_tab_id;

		while ($(".__tab[data-tab_id='" + tab_id + "']").attr("data-next_tab_id")) {
			result = result.add(
				$("<span>").addClass("step").attr("data-tab_id", tab_id)
			);
			tab_id = $(".__tab[data-tab_id='" + tab_id + "']").attr("data-next_tab_id");
		}

		return result;
	};

	var BuildStepIndicators = function (start_tab_id) {
		$("#step_indicators").empty().append(GetStepIndicators_DOM(start_tab_id));

		return;
	};

	var CompleteStepIndicator = function (tab_id) {
		$("#step_indicators .step[data-tab_id=\"" + tab_id + "\"]").addClass("complete");
	};

	var HighlightStepIndicator = function (tab_id) {
		$("#step_indicators .step[data-tab_id=\"" + tab_id + "\"]").addClass("active");
	};

	var DimStepIndicator = function (tab_id) {
		$("#step_indicators .step[data-tab_id=\"" + tab_id + "\"]").removeClass("active");
	};

	var ConvertArrToObj = function (arr) {
		let result = {};

		arr.forEach(function (item) {
			result[item.name] = item.val;
		});

		return result;
	};

	var Build_CallStack_and_SubmitDataToBackend = function () {
		let curr_tag = $("#navigate_next");
		let arr = GetTagMedicalObjects_AndAssignUniqDataID();
		let params = ConvertArrToObj(arr);

		params["action"] = "AJAX_submitMedicalRecord";
		params["patient_id"] = patient_id_from_url_global;

		curr_tag.button("loading");

		$.post("/cgi-bin/doctor.cgi", params)
			.done(function (data) {
				let obj = JSON.parse(data);

				if (obj.result == "success") {
					window.location.href = "/cgi-bin/doctor.cgi?action=medical_record_add_template&rand=" + Math.random() * 98765432123456;
				}
				else {
					system_calls.PopoverError(curr_tag, "Ошибка: " + obj.description);
				}
			})
			.fail(function () {
				setTimeout(function () {
					system_calls.PopoverError(curr_tag, "Ошибка ответа сервера");
				}, 100);
			})
			.always(function () {
				curr_tag.button("reset");
			});

	};


	var UpdateZipCode_InputHandler = function () {
		let curr_tag = $(this);
		let zip = curr_tag.val();

		if (zip.length == 6) {
			if (zip.match(/\d{6}/)) {
				$.getJSON(
					"/cgi-bin/ajax_anyrole_1.cgi",
					{
						action: "AJAX_getRussianLocalityByZip",
						zip: zip,
					})
					.done(function (data) {
						if (data.result == "success") {
							$("input.___region").val(data.zip.locality.region.title);
							$("input.___locality").val(data.zip.locality.title);
						}
						else {
							system_calls.PopoverError(curr_tag, "Ошибка: " + data.description);
						}
					})
					.fail(function () {
						setTimeout(function () {
							system_calls.PopoverError(curr_tag, "Ошибка ответа сервера");
						}, 500);
					});
			}
			else {
				system_calls.PopoverError(curr_tag, "Индекс должен быть 6 цифр");
			}
		}
	};

	// --- submit part
	var IsClassAssigned = function (tag, reg_exp) {
		let result = false;

		if (tag) {
			if (tag.attr("class")) {
				let classes = tag.attr("class").split(/ /);

				for (let i = 0; i < classes.length; ++i) {
					if (reg_exp.test(classes[i])) result = true;
				}
			}
		}
		else {
			console.error("tag is undefined");
		}

		return result;
	};

	var GetMedicalClass = function (tag) {
		let result = "";

		if (tag) {
			tag.attr("class").split(/ /).forEach(
				function (elem) {
					if ((elem[0] == "_") && (elem[1] == "_") && (elem[2] == "_")) {
						if (result.length) console.error("more than one medical class detected (" + result + ", " + elem + ") tag: " + tag);

						result = elem;
					}

				});

			if (result.length === 0) {
				console.error("medical class not found on element " + tag);
			}
		}
		else {
			console.error("tag is undefined");
		}

		return result;
	};

	var GetDomParentsChain = function (tag) {
		let parents = [];
		let curr_tag = tag;

		do {
			parents.push(curr_tag);
			curr_tag = curr_tag.parent();
		} while (!curr_tag.attr("class") || curr_tag.attr("class").split(/ /).indexOf("__tab") == -1);

		parents.push(curr_tag);

		return parents;
	};

	var GetPointerInputTag = function (parent_tag, tag_class) {
		// --- first check input fields as well as checkboxes
		let result_tag = parent_tag.find("input[data-target*=\"" + tag_class + "\"]");

		if (result_tag.length == 0) {
			// --- check select -> option tag
			result_tag = parent_tag.find("option[data-target=\"" + tag_class + "\"]");
		}

		return result_tag;
	};

	var GetInputCollapseChain = function (chain) {
		let result = [];

		if (chain.length && (IsClassAssigned(chain[0], /\b__tab/) == false)) {
			let medical_class = GetMedicalClass(chain[0]);
			let is_collapse = IsClassAssigned(chain[0], /collapse/);
			let pointer_class = (is_collapse ? ".collapse" : "") + "." + medical_class;

			if (medical_class.length === 0) {
				console.error("medical_class not found, but must be at that level");
			}
			else if (chain.length == 1) {
				console.error("medical_class not lenghty enough (hope never hit this line)");
			}
			else {
				for (let i = 1; i < chain.length; ++i) {
					let curr_tag = chain[i];
					let pointer_elem = GetPointerInputTag(curr_tag, pointer_class);

					if (pointer_elem.length > 1) {
						console.error("pointer_elem.length > 1, the only element have to point to child, otherwise DOM have to be fixed. " + pointer_elem);
					}
					else if (pointer_elem.length == 1) {
						// let	temp_tag = GetInputCollapseChain(chain.slice(i, chain.length));
						result.push(pointer_elem);
						pointer_class = "";
						// break;
					}

					// --- this if will find collapsible
					if (IsClassAssigned(curr_tag, /\b___/)) {
						let temp_tag = GetInputCollapseChain(chain.slice(i, chain.length));

						result.push(curr_tag);
						result = result.concat(temp_tag);

						break;
					}
				}
			}
		}

		return result;
	};

	var GetInputChain = function (input_collapse_chain) {
		let input_chain_with_dups = input_collapse_chain.filter(function (item) {
			let tag_name = item.prop("tagName");

			return (tag_name == "SELECT") || (tag_name == "OPTION") || (tag_name == "INPUT") || (tag_name == "TEXTAREA");
		});
		let input_chain = [];

		for (let i = 0; i < input_chain_with_dups.length; ++i) {
			let append_flag = true;

			for (let j = 0; j < input_chain.length; ++j) {
				if (input_chain_with_dups[i].is(input_chain[j])) append_flag = false;
			}

			if (append_flag) input_chain.push(input_chain_with_dups[i]);
		}

		return input_chain;
	};

	var GetTagValue = function (tag) {
		var result = "";

		if (tag.prop("tagName") == "SELECT") {
			if (tag.val() == null) {
				const failed_class = tag[0].classList[tag[0].classList.length - 1]
				const failed_tag = failed_class.substring(3)
				const failed_tag_localized = common_infomed_stat.GetRussianSpelling(failed_tag)

				system_calls.PopoverError("navigate_next", `Некорректное значение в поле "${failed_tag_localized}". <br><br>Если у вас активен переводчик - отключите.`)
				throw new Error("### data send failed")  // exception only to stop browser from progressing
				// correct way of doing it is to return error all the way back, rather than throwing
			}
			else if (tag.val().search("Не опр") == 0) { /* nothing to do */ }
			else result = tag.val();
		}
		else if ((tag.prop("tagName") == "INPUT") && tag.attr("type") && (tag.attr("type") == "checkbox")) {
			if (tag.is(":checked")) result = "Y";
		}
		else {
			result = tag.val();
		}


		return result;
	};

	var GetNameValueChain = function (input_chain) {
		let result = { name: "", val: GetTagValue(input_chain[0]) };

		for (var i = 0; i < input_chain.length; ++i) {
			result.name = GetMedicalClass(input_chain[i]) + result.name;
			if (GetTagValue(input_chain[i]) == "") result.val = "";
		}

		return result;
	};

	var GetTagMedicalObject = function (tag) {
		let dom_chain = GetDomParentsChain(tag);
		let input_collapse_chain = GetInputCollapseChain(dom_chain);

		input_collapse_chain.unshift(tag);

		let input_chain = GetInputChain(input_collapse_chain);
		let name_chain = GetNameValueChain(input_chain);

		return name_chain;
	};


	var GetTagMedicalObjects_AndAssignUniqDataID = function () {
		let tag_names = [];

		$("input, textarea, select").each(function () {
			let curr_tag = $(this);

			if (IsClassAssigned(curr_tag, /^___/)) {
				let temp_obj = GetTagMedicalObject(curr_tag);

				tag_names.push(temp_obj);

				curr_tag
					.attr("data-medical_tag", "Y")
					.attr("data-uniq_medical_id", temp_obj.name);
				console.debug(temp_obj.name);
				// console.debug(temp_obj.name + " " + temp_obj.val);
			}
			else {
				// console.debug(curr_tag.prop("tagName") + " " + curr_tag.attr("class"));
			}
		});

		return tag_names;
	};

	var PlacePatientDataToForm = function (patient_data) {
		for (const [name, value_const] of Object.entries(patient_data[0])) {
			if (name.search("___") === 0) {
				let curr_tag = $("[data-uniq_medical_id=\"" + name + "\"]");
				let value = system_calls.ConvertTextToHTML(value_const);

				if (value.length) // --- keep untouched fields - untouched
				{
					if (curr_tag.prop("tagName") == "INPUT") {
						if (curr_tag.attr("type") && (curr_tag.attr("type") == "checkbox")) {
							if (value == "Y") curr_tag.click();
						}
						else {
							curr_tag.val(value);
						}

						curr_tag.trigger("change");
					}

					if (curr_tag.prop("tagName") == "TEXTAREA") {
						curr_tag
							.val(value)
							.trigger("change");
					}

					if (curr_tag.prop("tagName") == "SELECT") {
						if (value.length)
							curr_tag
								.val(value)
								.trigger("change");
					}
				}
			}
		}
	};

	var ActivateDOMHandlers = function () {
		$('select[data-medical_tag="Y"]').on("change", Select_ChangeHandler);
	};

	var ResetAndHideInputFieldsFromParentTag = function (tag) {
		tag.find("[data-medical_tag=\"Y\"]").each(function () {
			let curr_tag = $(this);

			if (curr_tag.prop("tagName") == "INPUT") {
				if (curr_tag.attr("type") && (curr_tag.attr("type") == "checkbox")) {
					if (curr_tag.prop("checked")) curr_tag.click();
				}
				else {
					curr_tag.val("");
				}

				curr_tag.trigger("change");
			}

			if (curr_tag.prop("tagName") == "TEXTAREA") {
				curr_tag
					.val("")
					.trigger("change");
			}

			if (curr_tag.prop("tagName") == "SELECT") {
				curr_tag
					.find("option:eq(0)")
					.prop("selected", "true")
					.trigger("change");
			}
		});

		tag.hide(100);
	};

	var Select_ChangeHandler = function () {
		let curr_select_tag = $(this);
		// let	curr_option_tag = curr_select_tag.find("option:selected");

		// --- hide all options with toggle attribute
		curr_select_tag.find('option[data-toggle="collapse"]').each(function () {
			let hide_selector = $(this).attr("data-target");

			if (hide_selector) {
				ResetAndHideInputFieldsFromParentTag($(hide_selector));
			}

		}
		);


		// --- show only selected
		let show_selector = curr_select_tag.find('option:selected[data-toggle="collapse"]').attr("data-target");
		if (show_selector) $("div.collapse" + show_selector).show(100);

	}

	return {
		Init: Init,
		GetTagMedicalObject: GetTagMedicalObject,
		GetTagMedicalObjects_AndAssignUniqDataID: GetTagMedicalObjects_AndAssignUniqDataID,
		ConvertArrToObj: ConvertArrToObj,
	};

})();
