// importScripts("/js/pages/common.js");

var ConvertHTMLToText = function(htmlText)
{
	var	result = htmlText;

	result = result.replace(/<br>/img, "\n");
	result = result.replace(/&amp;/img, "&");
	result = result.replace(/&lt;/img, "<");
	result = result.replace(/&gt;/img, ">");
	result = result.replace(/•/img, "*");
	result = result.replace(/&quot;/img, "\"");
	result = result.replace(/&#92;/img, "\\");
	result = result.replace(/&#39;/img, "'");
	result = result.replace(/^\s+/, '');
	result = result.replace(/\s+$/, '');

	return result;
};

onmessage = function(e)
{
	'use strict';

	var	JSON_dataForProfile;
	var	JSON_companyPosition = [];
	var	JSON_geoCountry = [];
	var	JSON_geoRegion = [];
	var	JSON_geoLocality = [];
	var	JSON_themes = [];

	var	JSONarrWithID_companyPosition = [];
	var	JSONarrWithID_geoCountry = [];
	var	JSONarrWithID_geoRegion = [];
	var	JSONarrWithID_geoLocality = [];
	var	JSONarrWithID_themes = [];

	var	httpRequest;
	var	objGeoRegion = {};

	function ParseBulkData()
	{
		if(httpRequest.readyState === XMLHttpRequest.DONE) {
		  if(httpRequest.status === 200) {
		  	var		data = JSON.parse(httpRequest.responseText);
		  	var		obj2Send = {};

		  	JSON_dataForProfile = data;

			data.company_position.forEach(function(item, i, arr)
			{
				JSON_companyPosition.push(ConvertHTMLToText(item.title));
				JSONarrWithID_companyPosition.push({id:item.id, value:ConvertHTMLToText(item.title)});
			});

			data.geo_country.forEach(function(item, i, arr)
			{
				JSON_geoCountry.push(ConvertHTMLToText(item.title));
				JSONarrWithID_geoCountry.push({id:item.id, value:ConvertHTMLToText(item.title)});
			});

			data.geo_region.forEach(function(item, i, arr)
			{
				JSON_geoRegion.push(ConvertHTMLToText(item.title));
				JSONarrWithID_geoRegion.push({id:item.id, value:ConvertHTMLToText(item.title)});
				objGeoRegion[item.id] = ConvertHTMLToText(item.title);
			});

			data.geo_locality.forEach(function(item, i, arr)
			{
				JSON_geoLocality.push(ConvertHTMLToText(item.title) + (item.geo_region_id != "0" ? " (" + objGeoRegion[item.geo_region_id] + ")" : ""));
				JSONarrWithID_geoLocality.push({id:item.id, label:ConvertHTMLToText(item.title) + (item.geo_region_id != "0" ? " (" + objGeoRegion[item.geo_region_id] + ")" : "")});
			});

			data.themes.forEach(function(item, i, arr)
			{
				JSON_themes.push({id:item.id, name:item.name, path:item.path });
			});

			obj2Send.JSON_dataForProfile = JSON_dataForProfile;

			obj2Send.JSON_companyPosition = JSON_companyPosition;
			obj2Send.JSON_geoCountry = JSON_geoCountry;
			obj2Send.JSON_geoRegion = JSON_geoRegion;
			obj2Send.JSON_geoLocality = JSON_geoLocality;
			obj2Send.JSON_themes = JSON_themes;

			postMessage(obj2Send);

		    close();
		  } else {
		    console.debug('ParseBulkData: ERROR: XMLHttpRequest returned not 200');
		  }
		}

	}

	httpRequest = new XMLHttpRequest();
	if(httpRequest)
	{
		httpRequest.onreadystatechange = ParseBulkData;
		httpRequest.open('GET', "/cgi-bin/index.cgi?action=AJAX_getDataForProfile&rand=" + Math.random() * 1234567890);
		httpRequest.send();
	}
	else
	{
		console.debug("edit_profile_worker:ERROR: creating XMLHttpRequest");
	}
};


