/* exported graph_dimensions */
/* globals infomed_stat,Plotly */

var	graph_dimensions = (function()
{
	"use strict";

	var	data_global;

	var	Init = function()
	{
		$.ajaxSetup({ cache: false });

		DisplayLoadingIndicator();

		GetInitialData();
	};

	var	GetInitialData = function()
	{
		var		currTag = $(".container").first();


		$.getJSON(
			"/cgi-bin/doctor.cgi",
			{
				"action":"AJAX_getMedicalRecords",
			})
			.done(function(data)
			{
				if(data.result == "success")
				{
					data_global = data;

					RenderGraph(data_global.medical_records);
				}
				else
				{
					system_calls.PopoverError(currTag, "Ошибка: " + data.description);
				}
			})
			.fail(function()
			{
				setTimeout(function() {
					system_calls.PopoverError(currTag, "Ошибка ответа сервера");
				}, 500);
			});
	};

	var	GetNotEmptyDimensionNames = function(medical_records)
	{
		let	result = {};

		medical_records.forEach(function(medical_record)
		{
			let		entries = Object.entries(medical_record);

			for(const [name, value] of entries)
			{
				if(name.search("___") === 0) // --- medical record
				{
					if(name == "___first_name") { /* good2go */ }
					else if(name == "___middle_name") { /* good2go */ }
					else if(name == "___zip_code") { /* good2go */ }
					else if(name == "___locality") { /* good2go */ }
					else if(name == "___region") { /* good2go */ }
					else if(name == "___birthdate") { /* good2go */ }
					else if(name == "___medical_history_number") { /* good2go */ }
					else if(name == "___phone") { /* good2go */ }
					else if(name == "___op_done___invasion_date") { /* good2go */ }
					else if(value.length) // --- value has been defined
					{
						result[name] = "";
					}
				}
			}
		});

		return result;
	};

	var	BuildDimensionNames = function(medical_records, dimension_names)
	{
			for(const [name, value] of Object.entries(dimension_names))
			{
				let	obj = 	{
								label: infomed_stat.GetMedicalItemNameSpelling(name),
							};

				dimension_names[name] = obj;
			}

		return dimension_names;
	};

	var	BuildDimensionValues = function(medical_records, dimension_names)
	{
			for(const [name, value] of Object.entries(dimension_names))
			{
				let	val_array = [];
				medical_records.forEach(function(medical_record)
					{
						val_array.push(medical_record[name]);
					});

				if(val_array.every(item => parseFloat(item)))
				{
					// --- values are numbers
					let	values = [];

					val_array.forEach(item => values.push(parseFloat(item)) || 0);

					dimension_names[name].values = values;
				}
				else
				{
					// --- values are categories
					let	values_hash = {};
					let	values = [];
					let	curr_idx = 1;
					let	tickvals = [];
					let	ticktext = [];

					// if(name == "___lymph_node_damage___number_lymph_node_damage")
						// debugger;

					val_array.forEach(function(item)
						{
							if(item == "") item = "неизв.";
							if(values_hash[item]) { /* good2go */ }
							else values_hash[item] = curr_idx++;

							values.push(values_hash[item]);
						});

					for(const [_ticktext, _tickvals] of Object.entries(values_hash))
					{
						tickvals.push(_tickvals);
						ticktext.push(_ticktext);
					}

					dimension_names[name].values = values;
					dimension_names[name].ticktext = ticktext;
					dimension_names[name].tickvals = tickvals;

					// debugger;
				}
			}

		return dimension_names;
	};

	var	GetGraphSrcData = function(medical_records)
	{
		let	result = [{
						type: "parcoords",
						line: {
/*							color: [0, 1],
							colorscale: [[0, 'red'], [1, 'green']],
*/
							color: "green",
						},
						labelangle: -20,
						dimensions: [],
					}];

		let	dimension_names = GetNotEmptyDimensionNames(medical_records);
		dimension_names = BuildDimensionNames(medical_records, dimension_names);
		dimension_names = BuildDimensionValues(medical_records, dimension_names);


		for(const [name, value] of Object.entries(dimension_names))
		{
			result[0].dimensions.push(value);
		}

		// debugger;

		return result;
	};

	var	RenderGraph = function(medical_records)
	{
		let	data = GetGraphSrcData(medical_records);

		HideLoadingIndicator();

		Plotly.plot("graph_dimensions", data, {width: 5000}, {showSendToCloud: true, responsive:false});
	};


	var	DisplayLoadingIndicator = function()
	{
		$("#LoadingModal").modal("show");
	};

	var	HideLoadingIndicator = function()
	{
		$("#LoadingModal").modal("hide");
	};

	return {
		Init: Init
	};

})();
