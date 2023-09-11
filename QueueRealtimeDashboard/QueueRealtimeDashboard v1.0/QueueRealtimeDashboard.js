var _filterQuery =  "SELECT channel, language, department,source, location,"
+ "SUM(contactsWaiting) as contactsWaiting, SUM(offered) as offered,"
+ "SUM(answered) as answered, SUM(abandoned) as abandoned,"
+ "SUM(answeredWithinThreshold) as answeredWithinThreshold,"
+ "SUM(answeredAfterThreshold) as answeredAfterThreshold, SUM(abandonedAfterThreshold) as abandonedAfterThreshold,"
+ "SUM(transferredInitiated) as transferredInitiated, SUM(transferredAccepted) as transferredAccepted," 
+ "SUM(acw) as acw, SUM(holds) as holds, SUM(activeTimeDuration) as activeTimeDuration,"
+ "SUM(acwDuration) as acwDuration, SUM(holdDuration) as holdDuration,"
+ "SUM(serviceLevel) as serviceLevel, SUM(contactsAtAgent) as contactsAtAgent,"
+ "SUM(heldContacts) as heldContacts, SUM(available) as available,"
+ "SUM(notReady) as notReady, MAX(maxWaitTime) as maxWaitTime, SUM(totalWaitTime) as totalWaitTime, SUM(replied) as replied," 
+ "SUM(averageSpeedOfAnswer) as averageSpeedOfAnswer, SUM(expectedWaitTime) as expectedWaitTime, SUM(consultAcceptedFromService) as consultAcceptedFromService,"
+ "SUM(consultInitiatedToService) as consultInitiatedToService, SUM(defered) as defered,SUM(defereedPercentage) as defereedPercentage,SUM(complete) as complete,"
+ "SUM(averageQueueTime) as averageQueueTime,SUM(emailActive) as emailActive, SUM(backlog) as backlog";

var _totalFilterQuery = "SELECT SUM(answered) as answered, SUM(abandoned) as abandoned,"
+ "SUM(answeredAfterThreshold) as answeredAfterThreshold, SUM(abandonedAfterThreshold) as abandonedAfterThreshold,"
+ "SUM(transferredAccepted) as transferredAccepted, SUM(acw) as acw,"
+ "SUM(holds) as holds, SUM(activeTimeDuration) as activeTimeDuration,"
+ "SUM(acwDuration) as acwDuration, SUM(holdDuration) as holdDuration, MAX(maxWaitTime) as maxWaitTime,SUM(totalWaitTime) as totalWaitTime,"
+ "SUM(waitTime) as waitTime, SUM(defered) as defered,SUM(emailActive) as emailActive,"
+ "SUM(contactsWaiting) as contactsWaiting, SUM(expectedWaitTime) as expectedWaitTime,SUM(consultAcceptedFromService) as consultAcceptedFromService";


var _locationFilterQuery = "SELECT SUM(answered) as answered, language, department,source, location ";



var queueList_raw = {};
var queueList_new = {};
var refreshQueueDashboard = false;

function get_response_queue() {

	var queryParam = 'ALL'; 
	var serviceName =  'getServiceDetailsList';

	$.ajax({
		url: KafkaMiddlewareURL + serviceName,
		type: 'POST',
		data: queryParam,
		cache: false,
		contentType: false,
		processData: false,
		headers:
		{
			"Accept": "application/json",
			"Content-Type": 'application/json'
		},
		complete: function (response) {

			if (response.status == 200 || response.status == 202) {
                //console.log('executeWebRequest ->  Successfully to execute web service - ' + response.responseText);
                var obj_data = JSON.parse(response.responseText);
              				
				load_data(obj_data);
			}
		}
	});
}

function load_data(obj_data) {

		queueList_raw = bindQueueDashboardDetailList(obj_data);

		var _channelDetails =  alasql("SELECT DISTINCT channel FROM ? ORDER BY channel", [queueList_raw]);
		var _languageDetails =  alasql("SELECT DISTINCT language FROM ? ORDER BY language", [queueList_raw]);
		var _locationDetails =  alasql("SELECT DISTINCT location FROM ? ORDER BY location", [queueList_raw]);
		var _departmentDetails =  alasql("SELECT DISTINCT department FROM ? ORDER BY department", [queueList_raw]);


		if(ddlLoaded == false){
			bindChannelDropDownValues(_channelDetails);
			bindLanguageDropDownValues(_languageDetails);
			bindCustomerLocDropDownValues(_locationDetails);
			bindDepartDropDownValues(_departmentDetails);
			ddlLoaded = true;
		}

		loadChannelDetails(queueList_raw);
		loadLanguageDetails(queueList_raw);
		loadLocationDetails(queueList_raw);
		loadDepartmentDetails(queueList_raw);

		var _query = "SELECT * FROM ? ";
		queueList_new = alasql(_query, [queueList_raw]);
}

function loadChannelDetails(_list) {
	
	var _filterChannel = " FROM ? GROUP BY channel ORDER BY channel";
	var _channelQuery = _filterQuery + _filterChannel;
	var queueList = alasql(_channelQuery, [_list]);
	
	var _locationQuery = _locationFilterQuery + " FROM ? GROUP BY channel, location";
	var locationList = alasql(_locationQuery, [_list]);

	var _totalQuery = _totalFilterQuery + " FROM ? "		
	var totalList = alasql(_totalQuery, [_list]);

	$("#tbl_perfchannel > tbody").html("");

	var html = "";

	for (var i = 0; i < queueList.length; i++) {

		if ((queueList[i].offered == 0 && queueList[i].answered == 0) && queueList[i].contactsWaiting == 0 && queueList[i].transferredAccepted == 0 && queueList[i].abandoned == 0) {
			continue;
		}

		html += "<tr class=\"parent service_" + i + "\" id=\'parent_" + i + "\'>";
		html += "<td class=\"table-tooltip\" style=\"white-space: nowrap\" data-label=\"Service Name\" >" + cleanHTML(queueList[i].channel) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"Contacts waiting\">" + cleanHTML(queueList[i].contactsWaiting) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"offered\">" + cleanHTML(queueList[i].offered) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"answered\">" + cleanHTML(queueList[i].answered) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"abandoned\">" + cleanHTML(queueList[i].abandoned) + "</td>";
		
		html += "<td class=\"perentCell align-center\" data-label=\"Backlog\">" + cleanHTML(queueList[i].backlog) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"Deferred\">" + cleanHTML(queueList[i].defered) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"Deferred%\">" + cleanHTML(calculateDeferredPercentage(queueList[i])) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"Complete\">" + cleanHTML(queueList[i].complete) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"Replied\">" + cleanHTML(queueList[i].replied) + "</td>";
		
		html += "<td class=\"perentCell align-center\" data-label=\"within threshold\">" + cleanHTML(queueList[i].answeredWithinThreshold) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"after threshold\">" +cleanHTML(queueList[i].answeredAfterThreshold) + "</td>";

		html += "<td class=\"average align-center\" data-label=\"Average Talk Time\">" + cleanHTML(calculateAverageTalkTime(queueList[i])) + "</td>";
		html += "<td class=\"average align-center\" data-label=\"Average Hold Time\">" + cleanHTML(calculateAverageHoldTime(queueList[i])) + "</td>";
		html += "<td class=\"average align-center\" data-label=\"Average Wrap Time\">" + cleanHTML(calculateAverageWrapTime(queueList[i])) + "</td>";
		html += "<td class=\"average align-center\" data-label=\"Average Handling Time\">" + cleanHTML(calculateAverageHandleTime(queueList[i])) + "</td>";
		html += "<td class=\"average align-center\" data-label=\"Average Queue time\">" + cleanHTML(calculateAverageQueueTime(queueList[i])) + "</td>";
		
		html += "<td class=\"average align-center\" data-label=\"Max Wait Time\">" + cleanHTML((queueList[i].maxWaitTime)) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"Transfered Initiated\">" + cleanHTML(queueList[i].transferredInitiated) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"Transfered Accepted\">" + cleanHTML(queueList[i].transferredAccepted) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"Consult Initiated\">" + cleanHTML(queueList[i].consultInitiatedToService) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"Consult Accepted\">" + cleanHTML(queueList[i].consultAcceptedFromService) + "</td>";

		html += "<td class=\"perentCell align-center\" data-label=\"Service Level\">" + cleanHTML(calculateServiceLevelPercentage(queueList[i])) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"Active Agents\">" + cleanHTML(queueList[i].contactsAtAgent) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"onhold\" >" + cleanHTML(queueList[i].heldContacts) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"Email Active\" >" + cleanHTML(queueList[i].emailActive) + "</td>";

		//html += "<td class=\"agents align-center\" data-label=\"Total Agents\">" + queueList[i].available + "</td>";
		//html += "<td class=\"queue align-center\" data-label=\"Not Ready\">" + queueList[i].notReady + "</td>";

		//html += "<td class=\"average align-center\" data-label=\"Average Speed of Answer\">" + convert_time(queueList[i].averageSpeedOfAnswer) + "</td>";
		html += "<td class=\"average align-center\" data-label=\"Expected Wait Time\">" + cleanHTML(calculateExpectedWaitTime(queueList[i])) + "</td>";
		
		html += "<td class=\"perentCell align-center\" data-label=\"DOH\">" + cleanHTML(findAnsweredCountinLocation(locationList, "DOH", "source",queueList[i].source)) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"WRO\">" + cleanHTML(findAnsweredCountinLocation(locationList, "WRO", "source", queueList[i].source)) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"AMD\">" + cleanHTML(findAnsweredCountinLocation(locationList, "AMD", "source", queueList[i].source)) + "</td>";
		html += "<td class=\"perentCell align-center\" data-label=\"CKG\">" + cleanHTML(findAnsweredCountinLocation(locationList, "CKG", "source", queueList[i].source)) + "</td>";
		
		html += "</tr>";
	}


	$('#tbl_perfchannel > tbody').append((html));

	$('#tbl_perfchannel > tfoot').html("");
	var result = [];
	$('#tbl_perfchannel tbody > tr').each(function () {
		var _style = $(this).css('display')
		if (_style != "none") {
			$('td', this).each(function (index, val) {
				if (!result[index])
					result[index] = 0;
				var _tdText = $(val).text() == '-' ? "0" : $(val).text();
				result[index] += cleanHTML((hhmmssTOseconds(_tdText)));
			});
		}
	});	
	result[0] = sentenceCase("Total");
	result[result.length - 5] = calculateExpectedWaitTime(totalList[0]);
	result[result.length - 9] = calculateServiceLevelPercentage(totalList[0]);
	result[result.length - 14] = (totalList[0].maxWaitTime);
	result[result.length - 15] = calculateAverageQueueTime(totalList[0]);
	result[result.length - 16] = calculateAverageHandleTime(totalList[0]);
	result[result.length - 17] = calculateAverageWrapTime(totalList[0]);
	result[result.length - 18] = calculateAverageHoldTime(totalList[0]);
	result[result.length - 19] = calculateAverageTalkTime(totalList[0]);
	result[result.length - 24] = calculateDeferredPercentage(totalList[0]);
	$('#tbl_perfchannel > tfoot').append(('<tr></tr>'));
	$(result).each(function () {
		$('#tbl_perfchannel tfoot tr').append(('<td class=\"align-center\">' + this + '</td>'))
	});
}

function loadLanguageDetails(_list) {

	var _filterLanguage = " FROM ? WHERE 1=1 ";
	var _whereQuery = "";
	if(ddlLang_SelectedChannel != undefined && ddlLang_SelectedChannel != "") {
		var _channelSelected ='';
		for (var i = 0; i < ddlLang_SelectedChannel.length; i++) {
			_channelSelected += "'" + ddlLang_SelectedChannel[i] + "',";
		}

		_whereQuery = " AND source in (" + _channelSelected.slice(0, -1) + ")";

	}
	if(ddlLang_SelectedDepart != undefined && ddlLang_SelectedDepart != "") {
		var _DepartSelected ='';
		for (var i = 0; i < ddlLang_SelectedDepart.length; i++) {
			_DepartSelected += "'" + ddlLang_SelectedDepart[i] + "',";
		}
		_whereQuery += " AND department in (" + _DepartSelected.slice(0, -1) + ")";
	}
	if(ddlLang_SelectedLoc != undefined && ddlLang_SelectedLoc != "") {
		var _LocSelected ='';
		for (var i = 0; i < ddlLang_SelectedLoc.length; i++) {
			_LocSelected += "'" + ddlLang_SelectedLoc[i] + "',";
		}
		_whereQuery += " AND location in (" + _LocSelected.slice(0, -1) + ")";

	}
	if(ddlLang_SelectedLocation != undefined && ddlLang_SelectedLocation != "") {
		_whereQuery += " AND location = '" + ddlLang_SelectedLocation +"'";
	}

	var _groupQuery = " GROUP BY language ORDER BY language"
	var _languageQuery = _filterQuery + _filterLanguage + _whereQuery + _groupQuery;
	var queueList = alasql(_languageQuery, [_list]);

	var _totalQuery = _totalFilterQuery + _filterLanguage + _whereQuery;
	var totalList = alasql(_totalQuery, [_list]);
	
		var _locationQuery = _locationFilterQuery + _filterLanguage + _whereQuery + " GROUP BY language, location";
	var locationList = alasql(_locationQuery, [_list]);

	$("#tbl_perflanguage > tbody").html("");
	var html_lang = "";

	for (var i = 0; i < queueList.length; i++) {
		
		if ((queueList[i].offered == 0 && queueList[i].answered == 0) && queueList[i].contactsWaiting == 0 && queueList[i].transferredAccepted == 0 && queueList[i].abandoned == 0) {
			continue;
		}

		if(ddlLang_SelectedLocation != undefined && ddlLang_SelectedLocation != "" ) {
			var answeredCount = findAnsweredCountinLocation(locationList, ddlLang_SelectedLocation, "language", queueList[i].language);
			if(answeredCount == 0)
				continue;
		}
		
		html_lang += "<tr class=\"parent service_" + i + "\" id=\'parent_" + i + "\'>";
		html_lang += "<td class=\"table-tooltip\" style=\"white-space: nowrap\" data-label=\"Service Name\" >" + cleanHTML(queueList[i].language) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"Contacts waiting\">" + cleanHTML(queueList[i].contactsWaiting) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"offered\">" + cleanHTML(queueList[i].offered) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"answered\">" + cleanHTML(queueList[i].answered) + "</td>";

		html_lang += "<td class=\"perentCell align-center\" data-label=\"abandoned\">" + cleanHTML(queueList[i].abandoned) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"Backlog\">" + cleanHTML(queueList[i].backlog) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"Deferred\">" + cleanHTML(queueList[i].defered) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"Deferred%\">" + cleanHTML(calculateDeferredPercentage(queueList[i])) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"Complete\">" + cleanHTML(queueList[i].complete) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"Replied\">" + cleanHTML(queueList[i].replied) + "</td>";

		html_lang += "<td class=\"perentCell align-center\" data-label=\"within threshold\">" + cleanHTML(queueList[i].answeredWithinThreshold) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"after threshold\">" + cleanHTML(queueList[i].answeredAfterThreshold) + "</td>";

		html_lang += "<td class=\"average align-center\" data-label=\"Average Talk Time\">" + cleanHTML(calculateAverageTalkTime(queueList[i])) + "</td>";
		html_lang += "<td class=\"average align-center\" data-label=\"Average Hold Time\">" + cleanHTML(calculateAverageHoldTime(queueList[i])) + "</td>";
		html_lang += "<td class=\"average align-center\" data-label=\"Average Wrap Time\">" + cleanHTML(calculateAverageWrapTime(queueList[i])) + "</td>";
		html_lang += "<td class=\"average align-center\" data-label=\"Average Handling Time\">" + cleanHTML(calculateAverageHandleTime(queueList[i])) + "</td>";
		html_lang += "<td class=\"average align-center\" data-label=\"Average Queue time\">" + cleanHTML(calculateAverageQueueTime(queueList[i])) + "</td>";


		html_lang += "<td class=\"average align-center\" data-label=\"Max Wait Time\">" + cleanHTML((queueList[i].maxWaitTime)) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"Transfered Initiated\">" + cleanHTML(queueList[i].transferredInitiated) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"Transfered Accepted\">" + cleanHTML(queueList[i].transferredAccepted) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"Consult Initiated\">" + cleanHTML(queueList[i].consultInitiatedToService) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"Consult Accepted\">" + cleanHTML(queueList[i].consultAcceptedFromService) + "</td>";


		html_lang += "<td class=\"perentCell align-center\" data-label=\"Service Level\">" + cleanHTML(calculateServiceLevelPercentage(queueList[i])) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"Active Agents\">" + cleanHTML(queueList[i].contactsAtAgent) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"onhold\" >" + cleanHTML(queueList[i].heldContacts) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"Email Active\" >" + cleanHTML(queueList[i].emailActive) + "</td>";
		//html_lang += "<td class=\"agents align-center\" data-label=\"Total Agents\">" + queueList[i].available) + "</td>";
		//html_lang += "<td class=\"queue align-center\" data-label=\"Not Ready\">" + queueList[i].notReady) + "</td>";

	    //html_lang += "<td class=\"average align-center\" data-label=\"Average Speed of Answer\">" + convert_time(queueList[i].averageSpeedOfAnswer) + "</td>";
		html_lang += "<td class=\"average align-center\" data-label=\"Expected Wait Time\">" + calculateExpectedWaitTime(queueList[i]) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"DOH\">" + cleanHTML(findAnsweredCountinLocation(locationList, "DOH", "language", queueList[i].language)) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"WRO\">" + cleanHTML(findAnsweredCountinLocation(locationList, "WRO", "language", queueList[i].language)) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"AMD\">" + cleanHTML(findAnsweredCountinLocation(locationList, "AMD", "language", queueList[i].language)) + "</td>";
		html_lang += "<td class=\"perentCell align-center\" data-label=\"CKG\">" + cleanHTML(findAnsweredCountinLocation(locationList, "CKG", "language", queueList[i].language)) + "</td>";

		html_lang += "</tr>";
	}

	$('#tbl_perflanguage > tbody').append((html_lang));

	$('#tbl_perflanguage > tfoot').html("");
	var result1 = [];
	$('#tbl_perflanguage tbody > tr').each(function () {
		var _style = $(this).css('display')
		if (_style != "none") {
			$('td', this).each(function (index, val) {
				if (!result1[index])
					result1[index] = 0;
				var _tdText = $(val).text() == '-' ? "0" : $(val).text();
				result1[index] += cleanHTML(hhmmssTOseconds(_tdText));
			});
		}
	});

	result1[0] = sentenceCase("Total");
	result1[result1.length - 5] = calculateExpectedWaitTime(totalList[0]);
	result1[result1.length - 9] = calculateServiceLevelPercentage(totalList[0]);
	result1[result1.length - 14] = (totalList[0].maxWaitTime);
	result1[result1.length - 15] = calculateAverageQueueTime(totalList[0]);
	result1[result1.length - 16] = calculateAverageHandleTime(totalList[0]);
	result1[result1.length - 17] = calculateAverageWrapTime(totalList[0]);
	result1[result1.length - 18] = calculateAverageHoldTime(totalList[0]);
	result1[result1.length - 19] = calculateAverageTalkTime(totalList[0]);
	result1[result1.length - 24] = calculateDeferredPercentage(totalList[0]);
	
	$('#tbl_perflanguage > tfoot').append(('<tr></tr>'));
	$(result1).each(function () {
		$('#tbl_perflanguage tfoot tr').append(('<td class=\"align-center\">' + this + '</td>'))
	});
}

function loadLocationDetails(_list) {
	
	var _filterCustomerLoc = " FROM ? WHERE 1=1 ";
	var _whereQuery = "";

	if(ddlLoc_SelectedChannel != undefined && ddlLoc_SelectedChannel != "") {
		var _channelSelected ='';
		for (var i = 0; i < ddlLoc_SelectedChannel.length; i++) {
			_channelSelected += "'" + ddlLoc_SelectedChannel[i] + "',";
		}

		_whereQuery = " AND channel in (" + _channelSelected.slice(0, -1) + ")";

	}
	if(ddlLoc_SelectedDepart != undefined && ddlLoc_SelectedDepart != "") {
		var _selected ='';
		for (var i = 0; i < ddlLoc_SelectedDepart.length; i++) {
			_selected += "'" + ddlLoc_SelectedDepart[i] + "',";
		}
		_whereQuery += " AND department in (" + _selected.slice(0, -1) + ")";
	}
	if(ddlLoc_SelectedLanguage != undefined && ddlLoc_SelectedLanguage != "") {
		var _selected ='';
		for (var i = 0; i < ddlLoc_SelectedLanguage.length; i++) {
			_selected += "'" + ddlLoc_SelectedLanguage[i] + "',";
		}
		_whereQuery += " AND language in (" + _selected.slice(0, -1) + ")";

	}

	if(ddlLoc_SelectedLocation != undefined && ddlLoc_SelectedLocation != "") {
		_whereQuery += " AND location = '" + ddlLoc_SelectedLocation +"'";
	}

	var _groupQuery = " GROUP BY location ORDER BY location"

	var _customerLocQuery = _filterQuery + _filterCustomerLoc + _whereQuery + _groupQuery;
	var queueList = alasql(_customerLocQuery, [_list]);
	
	var _totalQuery = _totalFilterQuery + _filterCustomerLoc + _whereQuery;
	var totalList = alasql(_totalQuery, [_list]);

	var _locationQuery = _locationFilterQuery  + _filterCustomerLoc + _whereQuery + "GROUP BY location";
	var locationList = alasql(_locationQuery, [_list]);

	$("#tbl_perfcustomerloc > tbody").html("");
	var html_Loc = "";

	for (var i = 0; i < queueList.length; i++) {

		if ((queueList[i].offered == 0 && queueList[i].answered == 0) && queueList[i].contactsWaiting == 0 && queueList[i].transferredAccepted == 0 && queueList[i].abandoned == 0) {
			continue;
		}

		if(ddlLoc_SelectedLocation != undefined && ddlLoc_SelectedLocation != "" ) {
			var answeredCount = findAnsweredCountinLocation(locationList, ddlLoc_SelectedLocation, "location", queueList[i].location);
			if(answeredCount == 0)
				continue;
		} 

		html_Loc += "<tr class=\"parent service_" + i + "\" id=\'parent_" + i + "\'>";
		html_Loc += "<td class=\"table-tooltip\" style=\"white-space: nowrap\" data-label=\"Service Name\" >" + cleanHTML(queueList[i].location) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Contacts waiting\">" + cleanHTML(queueList[i].contactsWaiting) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"offered\">" + cleanHTML(queueList[i].offered) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"answered\">" + cleanHTML(queueList[i].answered) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"abandoned\">" + cleanHTML(queueList[i].abandoned) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Backlog\">" + cleanHTML(queueList[i].backlog) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Deferred\">" + cleanHTML(queueList[i].defered) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Deferred%\">" + cleanHTML(calculateDeferredPercentage(queueList[i])) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Complete\">" + cleanHTML(queueList[i].complete) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Replied\">" + cleanHTML(queueList[i].replied) + "</td>";

		html_Loc += "<td class=\"perentCell align-center\" data-label=\"within threshold\">" + cleanHTML(queueList[i].answeredWithinThreshold) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"after threshold\">" + cleanHTML(queueList[i].answeredAfterThreshold) + "</td>";

		html_Loc += "<td class=\"average align-center\" data-label=\"Average Talk Time\">" + cleanHTML(calculateAverageTalkTime(queueList[i])) + "</td>";
		html_Loc += "<td class=\"average align-center\" data-label=\"Average Hold Time\">" + cleanHTML(calculateAverageHoldTime(queueList[i])) + "</td>";
		html_Loc += "<td class=\"average align-center\" data-label=\"Average Wrap Time\">" + cleanHTML(calculateAverageWrapTime(queueList[i])) + "</td>";
		html_Loc += "<td class=\"average align-center\" data-label=\"Average Handling Time\">" + cleanHTML(calculateAverageHandleTime(queueList[i])) + "</td>";
		html_Loc += "<td class=\"average align-center\" data-label=\"Average Queue time\">" + cleanHTML(calculateAverageQueueTime(queueList[i])) + "</td>";

		html_Loc += "<td class=\"average align-center\" data-label=\"Max Wait Time\">" + cleanHTML((queueList[i].maxWaitTime)) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Transfered Initiated\">" + cleanHTML(queueList[i].transferredInitiated) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Transfered Accepted\">" + cleanHTML(queueList[i].transferredAccepted) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Consult Initiated\">" + cleanHTML(queueList[i].consultInitiatedToService) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Consult Accepted\">" + cleanHTML(queueList[i].consultAcceptedFromService) + "</td>";

		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Service Level\">" + cleanHTML(calculateServiceLevelPercentage(queueList[i])) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Active Agents\">" + cleanHTML(queueList[i].contactsAtAgent) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"onhold\" >" + cleanHTML(queueList[i].heldContacts) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"Email Active\" >" + cleanHTML(queueList[i].emailActive) + "</td>";

		//html_Loc += "<td class=\"agents align-center\" data-label=\"Total Agents\">" + queueList[i].available) + "</td>";
		//html_Loc += "<td class=\"queue align-center\" data-label=\"Not Ready\">" + queueList[i].notReady) + "</td>";

	    //html_Loc += "<td class=\"average align-center\" data-label=\"Average Speed of Answer\">" + convert_time(queueList[i].averageSpeedOfAnswer)) + "</td>";
		html_Loc += "<td class=\"average align-center\" data-label=\"Expected Wait Time\">" + cleanHTML(calculateExpectedWaitTime(queueList[i])) + "</td>";

		html_Loc += "<td class=\"perentCell align-center\" data-label=\"DOH\">" + cleanHTML(findAnsweredCountinLocation(locationList, "DOH", "location", queueList[i].location)) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"WRO\">" + cleanHTML(findAnsweredCountinLocation(locationList, "WRO", "location", queueList[i].location)) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"AMD\">" + cleanHTML(findAnsweredCountinLocation(locationList, "AMD", "location", queueList[i].location)) + "</td>";
		html_Loc += "<td class=\"perentCell align-center\" data-label=\"CKG\">" + cleanHTML(findAnsweredCountinLocation(locationList, "CKG", "location", queueList[i].location)) + "</td>";

		html_Loc += "</tr>";
	}

	$('#tbl_perfcustomerloc > tbody').append((html_Loc));

	$('#tbl_perfcustomerloc > tfoot').html("");
	var result2 = [];
	$('#tbl_perfcustomerloc tbody > tr').each(function () {
		var _style = $(this).css('display')
		if (_style != "none") {
			$('td', this).each(function (index, val) {
				if (!result2[index])
					result2[index] = 0;
				var _tdText = $(val).text() == '-' ? "0" : $(val).text();
				result2[index] += cleanHTML(hhmmssTOseconds(_tdText));
			});
		}
	});



	result2[0] = sentenceCase("Total");
	result2[result2.length - 5] = calculateExpectedWaitTime(totalList[0]);
	result2[result2.length - 9] = calculateServiceLevelPercentage(totalList[0]);
	result2[result2.length - 14] = (totalList[0].maxWaitTime);
	result2[result2.length - 15] = calculateAverageQueueTime(totalList[0]);
	result2[result2.length - 16] = calculateAverageHandleTime(totalList[0]);
	result2[result2.length - 17] = calculateAverageWrapTime(totalList[0]);
	result2[result2.length - 18] = calculateAverageHoldTime(totalList[0]);
	result2[result2.length - 19] = calculateAverageTalkTime(totalList[0]);
	result2[result2.length - 24] = calculateDeferredPercentage(totalList[0]);

	$('#tbl_perfcustomerloc > tfoot').append(('<tr></tr>'));
	$(result2).each(function () {
		$('#tbl_perfcustomerloc tfoot tr').append(('<td class=\"align-center\">' + this + '</td>'))
	});
}

function loadDepartmentDetails(_list) {

	var _filterDeparts = " FROM ? WHERE 1=1 ";
	var _whereQuery = "";

	if(ddlDepart_SelectedChannel != undefined && ddlDepart_SelectedChannel != "") {
		var _selected ='';
		for (var i = 0; i < ddlDepart_SelectedChannel.length; i++) {
			_selected += "'" + ddlDepart_SelectedChannel[i] + "',";
		}

		_whereQuery = " AND channel in (" + _selected.slice(0, -1) + ")";

	}
	if(ddlDepart_SelectedLanguage != undefined && ddlDepart_SelectedLanguage != "") {
		var _selected ='';
		for (var i = 0; i < ddlDepart_SelectedLanguage.length; i++) {
			_selected += "'" + ddlDepart_SelectedLanguage[i] + "',";
		}
		_whereQuery += " AND language in (" + _selected.slice(0, -1) + ")";
	}

	if(ddlDepart_SelectedLocation != undefined && ddlDepart_SelectedLocation != "") {
		_whereQuery += " AND location = '" + ddlDepart_SelectedLocation +"'";
	}

	var _groupQuery = " GROUP BY department ORDER BY department"

	var _DepartsQuery = _filterQuery + _filterDeparts + _whereQuery + _groupQuery;

	var queueList = alasql(_DepartsQuery, [_list]);
	
	var _totalQuery = _totalFilterQuery + _filterDeparts + _whereQuery;
	var totalList = alasql(_totalQuery, [_list]);


	var _locationQuery = _locationFilterQuery  + _filterDeparts + _whereQuery + "GROUP BY department, location";
	var locationList = alasql(_locationQuery, [_list]);

	$("#tbl_perfdepartment > tbody").html("");
		var html_Depart = "";

		for (var i = 0; i < queueList.length; i++) {
			
			if ((queueList[i].offered == 0 && queueList[i].answered == 0) && queueList[i].contactsWaiting == 0 && queueList[i].transferredAccepted == 0 && queueList[i].abandoned == 0) {
				continue;
			}

			if(ddlDepart_SelectedLocation != undefined && ddlDepart_SelectedLocation != "" ) {
				var answeredCount = findAnsweredCountinLocation(locationList, ddlDepart_SelectedLocation, "department", queueList[i].department);
				if(answeredCount == 0)
					continue;
			} 
			
			html_Depart += "<tr class=\"parent Depart_" + i + "\" id=\'parent_" + i + "\'>";
			html_Depart += "<td class=\"table-tooltip\" style=\"white-space: nowrap\" data-label=\"Depart Name\" >" + cleanHTML(queueList[i].department) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Contacts waiting\">" + cleanHTML(queueList[i].contactsWaiting) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"offered\">" + cleanHTML(queueList[i].offered) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"answered\">" + cleanHTML(queueList[i].answered) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"abandoned\">" + cleanHTML(queueList[i].abandoned) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Backlog\">" + cleanHTML(queueList[i].backlog) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Deferred\">" + cleanHTML(queueList[i].defered) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Deferred%\">" + cleanHTML(calculateDeferredPercentage(queueList[i])) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Complete\">" + cleanHTML(queueList[i].complete) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Replied\">" + cleanHTML(queueList[i].replied) + "</td>";


			html_Depart += "<td class=\"perentCell align-center\" data-label=\"within threshold\">" + cleanHTML(queueList[i].answeredWithinThreshold) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"after threshold\">" + cleanHTML(queueList[i].answeredAfterThreshold) + "</td>";
	
			html_Depart += "<td class=\"average align-center\" data-label=\"Average Talk Time\">" + cleanHTML(calculateAverageTalkTime(queueList[i])) + "</td>";
			html_Depart += "<td class=\"average align-center\" data-label=\"Average Hold Time\">" + cleanHTML(calculateAverageHoldTime(queueList[i])) + "</td>";
			html_Depart += "<td class=\"average align-center\" data-label=\"Average Wrap Time\">" + cleanHTML(calculateAverageWrapTime(queueList[i])) + "</td>";
			html_Depart += "<td class=\"average align-center\" data-label=\"Average Handling Time\">" + cleanHTML(calculateAverageHandleTime(queueList[i])) + "</td>";
			html_Depart += "<td class=\"average align-center\" data-label=\"Average Queue time\">" + cleanHTML(calculateAverageQueueTime(queueList[i])) + "</td>";
			html_Depart += "<td class=\"average align-center\" data-label=\"Max Wait Time\">" +  cleanHTML((queueList[i].maxWaitTime)) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Transfered Accepted\">" +  cleanHTML(queueList[i].transferredInitiated) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Transfered Accepted\">" +  cleanHTML(queueList[i].transferredAccepted) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Consult Initiated\">" + cleanHTML(queueList[i].consultInitiatedToDepart) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Consult Accepted\">" + cleanHTML(queueList[i].consultAcceptedFromDepart) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Service Level\">" +  cleanHTML(calculateServiceLevelPercentage(queueList[i])) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Active Agents\">" +  cleanHTML(queueList[i].contactsAtAgent) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"onhold\" >" +  cleanHTML(queueList[i].heldContacts) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"Email Active\" >" + cleanHTML(queueList[i].emailActive) + "</td>";
	
			//html_Depart += "<td class=\"agents align-center\" data-label=\"Total Agents\">" + queueList[i].available + "</td>";
			//html_Depart += "<td class=\"queue align-center\" data-label=\"Not Ready\">" + queueList[i].notReady + "</td>";
	
	        //html_Depart += "<td class=\"average align-center\" data-label=\"Average Speed of Answer\">" + convert_time(queueList[i].averageSpeedOfAnswer) + "</td>";
			html_Depart += "<td class=\"average align-center\" data-label=\"Expected Wait Time\">" +  cleanHTML(calculateExpectedWaitTime(queueList[i])) + "</td>";

			html_Depart += "<td class=\"perentCell align-center\" data-label=\"DOH\">" + cleanHTML(findAnsweredCountinLocation(locationList, "DOH", "department", queueList[i].department)) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"WRO\">" + cleanHTML(findAnsweredCountinLocation(locationList, "WRO", "department", queueList[i].department)) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"AMD\">" + cleanHTML(findAnsweredCountinLocation(locationList, "AMD", "department", queueList[i].department)) + "</td>";
			html_Depart += "<td class=\"perentCell align-center\" data-label=\"CKG\">" + cleanHTML(findAnsweredCountinLocation(locationList, "CKG", "department", queueList[i].department)) + "</td>";
	
			html_Depart += "</tr>";
		}

		$('#tbl_perfdepartment > tbody').append((html_Depart));

		$('#tbl_perfdepartment > tfoot').html("");
		var result3 = [];
		$('#tbl_perfdepartment tbody > tr').each(function () {
			var _style = $(this).css('display')
			if (_style != "none") {
				$('td', this).each(function (index, val) {
					if (!result3[index])
						result3[index] = 0;
					var _tdText = $(val).text() == '-' ? "0" : $(val).text();
					result3[index] += cleanHTML(hhmmssTOseconds(_tdText));
				});
			}
		});

		result3[0] = sentenceCase("Total");
		result3[result3.length - 5] = calculateExpectedWaitTime(totalList[0]);
		result3[result3.length - 9] = calculateServiceLevelPercentage(totalList[0]);
		result3[result3.length - 14] = (totalList[0].maxWaitTime);
		result3[result3.length - 15] = calculateAverageQueueTime(totalList[0]);
		result3[result3.length - 16] = calculateAverageHandleTime(totalList[0]);
		result3[result3.length - 17] = calculateAverageWrapTime(totalList[0]);
		result3[result3.length - 18] = calculateAverageHoldTime(totalList[0]);
		result3[result3.length - 19] = calculateAverageTalkTime(totalList[0]);
		result3[result3.length - 24] = calculateDeferredPercentage(totalList[0]);
	
		$('#tbl_perfdepartment > tfoot').append(('<tr></tr>'));
		$(result3).each(function () {
			$('#tbl_perfdepartment tfoot tr').append(('<td class=\"align-center\">' + this + '</td>'))
		});
}

function bindChannelDropDownValues(_details){
	$('#ddlLang_Channel').empty();
	$('#ddlLoc_Channel').empty();
	$('#ddlDepart_Channel').empty();

    if (_details != undefined) {
        for (var i = 0; i < _details.length; i++) {
			var _appendText = ("<option value='" + cleanHTML(_details[i].source) + "'>" + cleanHTML(_details[i].source) + "</option>");
            $('#ddlLang_Channel').append(_appendText);
			$('#ddlLoc_Channel').append(_appendText);
			$('#ddlDepart_Channel').append(_appendText);
        }
    }

	$('#ddlLang_Channel').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        onChange: function (element, checked) {
            //var _teams = $('#ddlLang_Channel option:selected');
            ddlLang_SelectedChannel = ($('#ddlLang_Channel').val() == "None" ? '' : $('#ddlLang_Channel').val());
            //$(_teams).each(function (index, team) {
            //    ddlLang_SelectedChannel.push([$(this).val()]);
            //});
            onChannelDropDownChangeFromLanguage(queueList_new, ddlLang_SelectedChannel);
		},
		onSelectAll: function () {
			ddlLang_SelectedChannel = '';
			onChannelDropDownChangeFromLanguage(queueList_new, ddlLang_SelectedChannel);
		},
		onDeselectAll: function () {
			ddlLang_SelectedChannel = '';
			onChannelDropDownChangeFromLanguage(queueList_new, ddlLang_SelectedChannel);
		}
	});

	$('#ddlLoc_Channel').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        onChange: function (element, checked) {
            //var _teams = $('#ddlLoc_Channel option:selected');
            ddlLoc_SelectedChannel = ($('#ddlLoc_Channel').val() == "None" ? '' : $('#ddlLoc_Channel').val());
			onChannelDropDownChangeFromLoc(queueList_new, ddlLoc_SelectedChannel); 
		},
		onSelectAll: function () {
			ddlLoc_SelectedChannel = '';
			onChannelDropDownChangeFromLoc(queueList_new, ddlLoc_SelectedChannel); 
		},
		onDeselectAll: function () {
			ddlLoc_SelectedChannel = '';
			onChannelDropDownChangeFromLoc(queueList_new, ddlLoc_SelectedChannel); 
		}
	});

	$('#ddlDepart_Channel').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        onChange: function (element, checked) {
           // var _teams = $('#ddlDepart_Channel option:selected');
            ddlDepart_SelectedChannel = ($('#ddlDepart_Channel').val() == "None" ? '' : $('#ddlDepart_Channel').val());
           
			onChannelDropDownChangeFromDepart(queueList_new, ddlDepart_SelectedChannel);
        },
		onSelectAll: function () {
			ddlDepart_SelectedChannel = '';
			onChannelDropDownChangeFromDepart(queueList_new, ddlDepart_SelectedChannel); 
		},
		onDeselectAll: function () {
			ddlDepart_SelectedChannel = '';
			onChannelDropDownChangeFromDepart(queueList_new, ddlDepart_SelectedChannel); 
		}
	});



}


function bindDepartDropDownValues(_details){

	$('#ddlLang_Depart').empty();
	$('#ddlLoc_Depart').empty();

   
	if (_details != undefined) {
        for (var i = 0; i < _details.length; i++) {
			var _appendText = ("<option value='" + cleanHTML(_details[i].department) + "'>" + cleanHTML(_details[i].department) + "</option>");
            $('#ddlLang_Depart').append(_appendText);
			$('#ddlLoc_Depart').append(_appendText);
        }
	}
	$('#ddlLang_Depart').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        onChange: function (element, checked) {
            ddlLang_SelectedDepart = ($('#ddlLang_Depart').val() == "None" ? '' : $('#ddlLang_Depart').val());
        },
		onSelectAll: function () {
			ddlLang_SelectedDepart = '';
			
		},
		onDeselectAll: function () {
			ddlLang_SelectedDepart = '';
			
		}
	});
	$('#ddlLoc_Depart').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        onChange: function (element, checked) {
           // var _teams = $('#ddlDepart_Channel option:selected');
		   ddlLoc_SelectedDepart = ($('#ddlLoc_Depart').val() == "None" ? '' : $('#ddlLoc_Depart').val());
         
        },
		onSelectAll: function () {
			ddlLoc_SelectedDepart = '';
			
		},
		onDeselectAll: function () {
			ddlLoc_SelectedDepart = '';
			
		}
	});

}

function bindLanguageDropDownValues(_details){

	$('#ddlLoc_Language').empty();
	$('#ddlDepart_Language').empty();

    if (_details != undefined) {
        for (var i = 0; i < _details.length; i++) {
			var _appendText = ("<option value='" + cleanHTML(_details[i].language) + "'>" + cleanHTML(_details[i].language) + "</option>");
            $('#ddlLoc_Language').append(_appendText);
			$('#ddlDepart_Language').append(_appendText);
      
        }
	}
	
	$('#ddlLoc_Language').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        onChange: function (element, checked) {
		   ddlLoc_SelectedLocation = ($('#ddlLoc_Language').val() == "None" ? '' : $('#ddlLoc_Language').val());

        },
		onSelectAll: function () {
			ddlLoc_SelectedLocation = '';			
		},
		onDeselectAll: function () {
			ddlLoc_SelectedLocation = '';
			
		}
	});

	$('#ddlDepart_Language').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        onChange: function (element, checked) {
           // var _teams = $('#ddlDepart_Channel option:selected');
		   ddlDepart_SelectedLanguage = ($('#ddlDepart_Language').val() == "None" ? '' : $('#ddlDepart_Language').val());
           
        },
		onSelectAll: function () {
			ddlDepart_SelectedLanguage = '';
			
		},
		onDeselectAll: function () {
			ddlDepart_SelectedLanguage = '';
			
		}
	});
}

function bindCustomerLocDropDownValues(_details){

	$('#ddlLang_Loc').empty();
	$('#ddlDepart_Loc').empty();

   
    if (_details != undefined) {
        for (var i = 0; i < _details.length; i++) {
			if(_details[i].location.toLowerCase() == "failure")
				continue;
			var _appendText = ("<option value='" + cleanHTML(_details[i].location) + "'>" + cleanHTML(_details[i].location) + "</option>");
			$('#ddlLang_Loc').append(_appendText);
			$('#ddlDepart_Loc').append(_appendText);
  
        }
	}
	

	$('#ddlLang_Loc').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        onChange: function (element, checked) {
           // var _teams = $('#ddlDepart_Channel option:selected');
		   ddlLang_SelectedLoc = ($('#ddlLang_Loc').val() == "None" ? '' : $('#ddlLang_Loc').val());
           
        },
		onSelectAll: function () {
			ddlLang_SelectedLoc = '';
			
		},
		onDeselectAll: function () {
			ddlLang_SelectedLoc = '';
			
		}
	});

	$('#ddlDepart_Loc').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        onChange: function (element, checked) {
           // var _teams = $('#ddlDepart_Channel option:selected');
		   ddlDepart_SelectedLoc = ($('#ddlDepart_Loc').val() == "None" ? '' : $('#ddlDepart_Loc').val());
           
        },
		onSelectAll: function () {
			ddlDepart_SelectedLoc = '';
			
		},
		onDeselectAll: function () {
			ddlDepart_SelectedLoc = '';
			
		}
	});
}



function onChannelDropDownChangeFromLanguage(data, selectedChannel){

	var _where = '';

	if(selectedChannel != null && selectedChannel.length > 0  && selectedChannel != "" ){
		var _channelSelected ='';
		for (var i = 0; i < selectedChannel.length; i++) {
			_channelSelected += "'" + selectedChannel[i] + "',";
		}

		_where = "WHERE channel in (" + _channelSelected.slice(0, -1) + ")";
	}

	var Loc_details = alasql("SELECT DISTINCT location FROM ? "+ _where +"  ORDER BY location", [data]);
	var Depart_details = alasql("SELECT DISTINCT department FROM ? "+ _where +"  ORDER BY department", [data]);

	$('#ddlLang_Loc').empty();
	$('#ddlLang_Depart').empty();

   
    if (Loc_details != undefined) {
        for (var i = 0; i < Loc_details.length; i++) {
			if(Loc_details[i].customerLoc.toLowerCase() == "failure")
				continue;
			var _appendText = ("<option value='" + cleanHTML(Loc_details[i].customerLoc) + "'>" + cleanHTML(Loc_details[i].customerLoc) + "</option>");
			$('#ddlLang_Loc').append(_appendText);

		}
		$('#ddlLang_Loc').multiselect('rebuild');
    }
	if (Depart_details != undefined) {
        for (var i = 0; i < Depart_details.length; i++) {

			var _appendText = ("<option value='" + cleanHTML(Depart_details[i].department) + "'>" + cleanHTML(Depart_details[i].department) + "</option>");
			$('#ddlLang_Depart').append(_appendText);
			
		}
		$('#ddlLang_Depart').multiselect('rebuild');
    }

}


function onChannelDropDownChangeFromLoc(data, selectedChannel){

	var _where = '';

	if(selectedChannel != null && selectedChannel.length > 0  && selectedChannel != "" ){
		var _channelSelected ='';
		for (var i = 0; i < selectedChannel.length; i++) {
			_channelSelected += "'" + selectedChannel[i] + "',";
		}

		_where = "WHERE source in (" + _channelSelected.slice(0, -1) + ")";
		//_where = "WHERE source = '"+ selectedChannel + "'";
	}
	var  Depart_details = alasql("SELECT DISTINCT department FROM ?  "+ _where +"  ORDER BY department", [data]);

	$('#ddlLoc_Depart').empty();
  
    //$('#ddlLoc_Depart').append(
    //    "<li class=\"active\"><data>None</data></li>");

	if (Depart_details != undefined) {
        for (var i = 0; i < Depart_details.length; i++) {
			var _appendText = ("<option value='" + cleanHTML(Depart_details[i].department) + "'>" + cleanHTML(Depart_details[i].department) + "</option>");
			$('#ddlLoc_Depart').append(_appendText);
			
		}
		$('#ddlLoc_Depart').multiselect('rebuild');
    }
}


function onChannelDropDownChangeFromDepart(data, selectedChannel){

	var _where = '';

	if(selectedChannel != null && selectedChannel.length > 0  && selectedChannel != "" ){
		var _channelSelected ='';
		for (var i = 0; i < selectedChannel.length; i++) {
			_channelSelected += "'" + selectedChannel[i] + "',";
		}

		_where = "WHERE source in (" + _channelSelected.slice(0, -1) + ")";
		//_where = "WHERE source = '"+ selectedChannel + "'";
	}

	var Loc_details = alasql("SELECT DISTINCT location FROM ? "+ _where +" ORDER BY location", [data]);
	
	$('#ddlDepart_Loc').empty();

    //$('#ddlDepart_Loc').append(
    //    "<li class=\"active\"><data>None</data></li>");
   
    if (Loc_details != undefined) {
        for (var i = 0; i < Loc_details.length; i++) {

			if(Loc_details[i].location.toLowerCase() == "failure")
				continue;
			var _appendText = ("<option value='" + cleanHTML(Loc_details[i].location) + "'>" + cleanHTML(Loc_details[i].location) + "</option>");
			$('#ddlDepart_Loc').append(_appendText);
            
		}
		$('#ddlDepart_Loc').multiselect('rebuild');
    }

}


function bindQueueDashboardDetailList(agentList) {
	var _list = [];
	var _serviceName = '';
	for (var i = 0; i < agentList.length; i++) {
		var _jsonValues = JSON.parse(agentList[i].serviceData);
		if (_jsonValues == null || _jsonValues == undefined) {
			return _list;
		}

		var _channelName = '';
		var _sourceName = '';
		var _language = '';
		var _service ='';
		var _location='';
		var _department='';
		if (agentList[i].serviceName != undefined) {
			var _attributes = agentList[i].serviceName.split("|");
			for (var attribute of _attributes) {
				var _attrSplit = attribute.split(".");
				if (_attrSplit[0] == "Channel")
					_channelName = _attrSplit[1];
				else if (_attrSplit[0] == "LANGUAGE")
					_language = _attrSplit[1];
				else if (_attrSplit[0] == "LOCATION")
					_location = _attrSplit[1];
				else if (_attrSplit[0] == "DEPARTMENT")
					_department = _attrSplit[1];
			}
		}
		var formulas = {
			serviceDisplayName: _serviceName == '' ? agentList[i].serviceName : _serviceName,
			serviceName: agentList[i].serviceName,
			language : _language == "" ? sentenceCase("English") : sentenceCase(_language),
			services : _service == "" ? sentenceCase("Failure") : sentenceCase(_service),
			channel : _channelName == "" ? sentenceCase("Failure") : sentenceCase(_channelName),
			location : _location == "" ? "Others" :_location,
			department : _department == "" ? "Failure" :_department,
			contactsWaiting: _jsonValues.contactsWaiting == undefined ? 0 : _jsonValues.contactsWaiting,
			offered: (_jsonValues.answered == undefined ? 0 : _jsonValues.answered) + (_jsonValues.abandoned == undefined ? 0 : _jsonValues.abandoned) +(_jsonValues.contactsWaiting == undefined ? 0 : _jsonValues.contactsWaiting),
			answered: _jsonValues.answered == undefined ? 0 : _jsonValues.answered,
			abandoned: _jsonValues.abandoned == undefined ? 0 : _jsonValues.abandoned,
			answeredWithinThreshold : ((_jsonValues.answered == undefined || _jsonValues.answered == 0) ? 0 : (_jsonValues.answered - (_jsonValues.answeredAfterThreshold == undefined ? 0 : _jsonValues.answeredAfterThreshold))),
			answeredAfterThreshold : _jsonValues.answeredAfterThreshold == undefined ? 0 : _jsonValues.answeredAfterThreshold,
			abandonedAfterThreshold : _jsonValues.abandonedAfterThreshold == undefined ? 0 : _jsonValues.abandonedAfterThreshold,
			transferredInitiated: _jsonValues.transferredInitiated == undefined ? 0 : _jsonValues.transferredInitiated,
			transferredAccepted: _jsonValues.transferredAccepted == undefined ? 0 : _jsonValues.transferredAccepted,
			acw: _jsonValues.acw == undefined ? 0 : _jsonValues.acw,
			holds: _jsonValues.holds == undefined ? 0 : _jsonValues.holds,
			activeTimeDuration: _jsonValues.activeTimeDuration == undefined ? 0 : _jsonValues.activeTimeDuration,
			acwDuration: _jsonValues.acwDuration == undefined ? 0 : _jsonValues.acwDuration,
			holdDuration: _jsonValues.holdDuration == undefined ? 0 : _jsonValues.holdDuration,
			serviceLevel: 0.00,
			contactsAtAgent: _jsonValues.contactsAtAgent == undefined ? 0 : _jsonValues.contactsAtAgent,
			heldContacts: _jsonValues.heldContacts == undefined ? 0 : _jsonValues.heldContacts,
			staffed: _jsonValues.staffed == undefined ? 0 : _jsonValues.staffed,
			available: _jsonValues.available == undefined ? 0 : _jsonValues.available,
			notReady:  _jsonValues.resourceInNotReady == undefined ? 0 : _jsonValues.resourceInNotReady,
			averageHandlingTime: "00:00:00",
			maxWaitTime: calculateMaxWaittime(_jsonValues),
			averageSpeedOfAnswer: (_jsonValues.averageSpeedOfAnswer == undefined ? 0 : parseInt(_jsonValues.averageSpeedOfAnswer)),
			expectedWaitTime: (_jsonValues.expectedWaitTime == undefined ? 0 :parseInt(_jsonValues.expectedWaitTime)),
			consultInitiatedToService: (_jsonValues.consultsInitiatedToService == undefined ? 0 :parseInt(_jsonValues.consultsInitiatedToService)),
			defered: (_jsonValues.deferredContacts == undefined ? 0 :_jsonValues.deferredContacts),
			complete: (_jsonValues.completed == undefined ? 0 : _jsonValues.completed),
			averageQueueTime: calculateAverageQueueTime(_jsonValues),
			totalWaitTime: (_jsonValues.totalWaitTime == undefined ? 0 : _jsonValues.totalWaitTime),
			backlog: calculateBacklog(_jsonValues),
			replied: (_jsonValues.replied == undefined ? 0 : _jsonValues.replied),
			emailActive: (_jsonValues.active==undefined ? 0 : _jsonValues.active),
			consultAcceptedFromService: (_jsonValues.consultsAcceptedFromService == undefined ? 0 :parseInt(_jsonValues.consultsAcceptedFromService)),				
		}
		_list.push(formulas);
	}
	return _list;
}

function calculateAverageQueueTime(_jsonValues){
	var _totalwaitTime = parseInt(_jsonValues.totalWaitTime == undefined ? 0 : _jsonValues.totalWaitTime);
	var _totalTime = parseInt(_jsonValues.answered == undefined ? 0 : _jsonValues.answered) + parseInt(_jsonValues.abandoned == undefined ? 0 : _jsonValues.abandoned); 
	var _avgWaitTime = (_totalTime == 0 ? 0 : (_totalwaitTime / _totalTime));
	return convert_time(_avgWaitTime);

}
function calculateBacklog(_jsonValues){
	var contactsWaiting= (_jsonValues.contactsWaiting == undefined ? 0 : parseInt(_jsonValues.contactsWaiting));
	var defered= (_jsonValues.deferredContacts == undefined ? 0 : parseInt(_jsonValues.deferredContacts));
	var backlog= contactsWaiting+defered;
	return backlog;

}

function calculateDeferredPercentage(_jsonValues){
	var defered = (_jsonValues.defered == undefined ? 0 : _jsonValues.defered);
	var answered = (_jsonValues.answered == undefined ? 0 : _jsonValues.answered);
	var _defered = (answered == 0 ? 0 : (parseInt(defered) / parseInt(answered)) * 100);
	if(Number.isNaN(_defered))
		return "0.00";
	return _defered.toFixed(2);

}
function calculateMaxWaittime(_jsonValues) {
	var oldestContactWaiting;
	if(_jsonValues.oldestContactWaiting == undefined ||_jsonValues.oldestContactWaiting == "UNKNOWN"){
		oldestContactWaiting=0;
		return convert_time(oldestContactWaiting);
	}else{
		var timestamp = parseInt(_jsonValues.oldestContactWaiting);
		var date = new Date(timestamp);
		var Current_time = new Date();
		return(timeDifference(Current_time,date));
	}
}

function timeDifference(date1,date2) {
    var difference = date1.getTime() - date2.getTime();

    var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    var hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    var minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    var secondsDifference = Math.floor(difference/1000);

	  var value=((hoursDifference<10?'0':'') + hoursDifference+
	  ":"+(minutesDifference<10?'0':'') + minutesDifference+
	  ":"+(secondsDifference<10?'0':'') + secondsDifference);
  return value;

}

function calculateAverageTalkTime(queueList) {
	var _activeTime = parseInt(queueList.activeTimeDuration == undefined ? 0 : queueList.activeTimeDuration);
	var _totalAnswered = parseInt(queueList.answered == undefined ? 0 : queueList.answered) + parseInt(queueList.transferredAccepted == undefined ? 0 : queueList.transferredAccepted)
	
	var _avgTalk = (_totalAnswered == 0 ? 0 : (_activeTime / _totalAnswered));
	return convert_time(_avgTalk);
}

function calculateAverageHoldTime(queueList) {
	var _totalHolds = parseInt(queueList.holdDuration == undefined ? 0 : queueList.holdDuration);
	var _totalAnswered = parseInt(queueList.answered == undefined ? 0 : queueList.answered) + parseInt(queueList.transferredAccepted == undefined ? 0 : queueList.transferredAccepted)
	var _avgHold = (_totalHolds == 0 ? 0 : (_totalHolds / _totalAnswered));
	return convert_time(_avgHold);
}

function calculateAverageWrapTime(queueList) {
	var _totalAcw = parseInt(queueList.acwDuration == undefined ? 0 : queueList.acwDuration);
	var _totalAnswered = parseInt(queueList.answered == undefined ? 0 : queueList.answered) + parseInt(queueList.transferredAccepted == undefined ? 0 : queueList.transferredAccepted)
	var _avgWrap = (_totalAcw == 0 ? 0 :(_totalAcw / _totalAnswered));
	return convert_time(_avgWrap);
}

function calculateAverageHandleTime(queueList) {
	var _activeTime = (queueList.activeTimeDuration == undefined ? 0 : queueList.activeTimeDuration);
	var _acwTime = (queueList.acwDuration == undefined ? 0 : queueList.acwDuration);
	var _holdTime = (queueList.holdDuration == undefined ? 0 : queueList.holdDuration);
	var _totalAnswered = parseInt(queueList.answered == undefined ? 0 : queueList.answered) + parseInt(queueList.transferredAccepted == undefined ? 0 : queueList.transferredAccepted)
	var _totalAcw = parseInt(queueList.acw == undefined ? 0 : queueList.acw);
	var _totalHolds = parseInt(queueList.holds == undefined ? 0 : queueList.holds);
	
	var _avgHandle = (_totalAnswered == 0 ? 0 : (parseInt(_activeTime) / _totalAnswered)) + (_totalAcw == 0 ? 0 :(parseInt(_acwTime) / _totalAnswered)) + 
			(_totalHolds == 0 ? 0 : (parseInt(_holdTime) / _totalAnswered));
	return convert_time(_avgHandle);
}
function calculateServiceLevelPercentage(queueList) {

	var _answered = (queueList.answered == undefined ? 0 : queueList.answered);
	var _abandoned = (queueList.abandoned == undefined ? 0 : queueList.abandoned);
	var _answeredAfterThreshold = (queueList.answeredAfterThreshold == undefined ? 0 : queueList.answeredAfterThreshold);
	var _abandonedAfterThreshold = (queueList.abandonedAfterThreshold == undefined ? 0 : queueList.abandonedAfterThreshold);
	
	var _serviceLevel = (_answered == 0 ? 0 : ((parseInt(_answered) - parseInt(_answeredAfterThreshold)) / parseInt(_answered)) * 100);
	
	if(_answered == 0) {
		return "-";
	}
	if(Number.isNaN(_serviceLevel))
		return "0.00";
	return _serviceLevel.toFixed(2);
}

function calculateTotalServiceLevelPercentage(){

	var _serviceLevel = (((parseInt(totalAnsweredContact) + parseInt(totalAbandonedContact)) - (parseInt(totalAnsweredAfterThreshold) + parseInt(totalAbandonedAfterThreshold))) / (parseInt(totalAnsweredContact) + parseInt(totalAbandonedContact))) * 100;
	if(Number.isNaN(_serviceLevel))
		return "0.00";
	return _serviceLevel.toFixed(2);
}

function calculateExpectedWaitTime(queueList){
	var _contactWaiting = parseInt(queueList.contactsWaiting == undefined ? 0 : queueList.contactsWaiting);
	var _expectedWaitTime =  parseInt(queueList.expectedWaitTime == undefined ? 0 : queueList.expectedWaitTime);

	var _totalETW = (_contactWaiting == 0 ? 0 : (_expectedWaitTime / _contactWaiting ));	

	return convert_time(_totalETW);
}

function findAnsweredCountinLocation(list, location, key, keyValue) {

	var _count = 0;
	var _obj = null;

	if(list == undefined || list == null || list.length == 0)
		return _count;

	//_obj = list.find(y => (y.location == location && key == keyValue))
	
	var _query = "SELECT answered from ? WHERE location = '"+ location +"' AND " + key +  "= '"+ keyValue + "'" ;
	var _obj = alasql(_query, [list]);
	
	if(_obj != null && _obj.length > 0){
		_count = _obj[0].answered; //_obj.answered; //
	}
	return _count;
}

function getServiceDetailsList() {
	$("#main").html("");

	$.ajax({
		url: KafkaMiddlewareURL + "getServiceDetailsList",
		type: 'POST',
		data:'0',
		cache: false,
		contentType: false,
		processData: false,
		
		headers:
		{
			"Accept": "application/json",
			"Content-Type": 'application/json'
		},
		success: function (response) {
			var _data = response;

			$.each(_data, function (key, value) {
                $("#ddlDepartList").append($("<option></option>").val(value.serviceName).text(value.serviceName));
               
			});
            //Multiselect
            $(document).ready(function () {
                $('#ddlDepartList').multiselect({
                    includeSelectAllOption: true,
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true,
                    buttonWidth: '100%'
                });

            });
        	//Multiselect
			get_response("QUEUE", serviceGroupName);
		},
		failure: function () {
			alert("Failed!");
		}
	});
}

function sentenceCase(value) {

	return value.replace(/\w\S*/g,
		function (txt) {
			return txt.toUpperCase();
			//return txt.charAt(0).toUpperCase() +
				//txt.substr(1).toLowerCase();
		});
}

function getParameterByName(name) {
	name = name.replace(/[\[\]]/g, '\\$&');

	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(encodeURLValue());
	if (!results) return null;
	if (!results[2]) return '';
	return results[2];
}

function cleanHTML(param) {
	if (String(param).match(/^(?:[a-zA-Z0-9\s@,=%$.:|\)(/#&-_\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF]|[\u0660-\u0669])){0,300}$/)) {
	 	return param;
	}
	 return '';
}

function encodeURLValue(){
	var value = encodeURI(window.location.href); 
	return value;
}

function WriteLog(type, msg) {
	if (IS_CONSOLE_LOG_ENABLE == false)
		return;
	var log = WIDGET_NAME + " --> " + type + " --> " + get_time() + " --> ";
	var log = WIDGET_NAME + " --> " + type + " --> " + get_time() + " --> ";
	if (type == INFO ) {
		console.log(`%c ${log}`, "color:Green;font-weight: bold", msg, "");
	}
	else if (type == DEBUG ) {
		console.log(`%c ${log}`, "color:DodgerBlue;font-weight: bold", msg, "");
	}
	else if (type == ERROR ) {
		console.log(`%c ${log}`, "color:Red;font-weight: bold", msg, "");
	}
	else if (type == WARNING ) {
		console.log(`%c ${log}`, "color:Orange;font-weight: bold", msg, "");
	}
}

function get_time() {
	var currentdate = new Date();
	return currentdate.getDate() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getFullYear() + " "
		+ currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
}

function get_time_stamp(timestamp) {
	if (Number.isNaN(timestamp) || timestamp == undefined) {
		return '00:00:00';
	}
	var startDate = new Date(parseInt(timestamp));
	
	var hours = startDate.getHours();
	 var minutes = startDate.getMinutes();
	 var seconds = startDate.getSeconds();

	 if (hours < 10) { hours = "0" + hours; }
	 if (minutes < 10) { minutes = "0" + minutes; }
	 if (seconds < 10) { seconds = "0" + seconds; }
	return startDate.getDate() +'-' + (startDate.getMonth() + 1) +'-' + startDate.getFullYear()
	+' ' +hours + ':' + minutes + ':' +  seconds;
}

function convert_time(num) {
	if (Number.isNaN(num) || num == undefined) {
		return '00:00:00';
	}
	num = Math.round(num);
	var sec_num = parseInt(num, 10);
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours < 10) { hours = "0" + hours; }
	if (minutes < 10) { minutes = "0" + minutes; }
	if (seconds < 10) { seconds = "0" + seconds; }
	return hours + ':' + minutes + ':' + seconds;
}

function hhmmssTOseconds(number) {
	
	if (number == undefined || number == '-') {
		return '0';
	}
	var _hms = number.split(':'); 

	if(_hms.length == 0 || _hms.length == 1) {
		if(typeof number === 'string' || number instanceof String)
			return parseFloat(number);
		else 
			return number;
	}
	var seconds = (+_hms[0]) * 60 * 60 + (+_hms[1]) * 60 + (+_hms[2]);
	return seconds;
}

function calculate_time(logon_duration, timestamp) {
	if (Number.isNaN(timestamp) || timestamp == undefined) {
		return '00:00:00';
	}

	var startDate = new Date(parseInt(timestamp));
	// Do your operations
	var endDate = new Date();
	var num = (endDate.getTime() - startDate.getTime()) / 1000;

	var sec_num = (logon_duration == undefined ? 0 : logon_duration) + parseInt(num, 10);
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours < 10) { hours = "0" + hours; }
	if (minutes < 10) { minutes = "0" + minutes; }
	if (seconds < 10) { seconds = "0" + seconds; }
	return hours + ':' + minutes + ':' + seconds;
}


/** * Event Listener to Dashboard Refresh - Start */
window.addEventListener('message', function (event) {
	WriteLog(INFO, "Listener for Dashboard --> START");
	//WriteLog(INFO, event.data);
	if (event.data.message.toString() == "DashboardInfo") {

		WriteLog(INFO, "Dashboard Refresh Event Received Successfully");

		refreshQueueDashboard = event.data.refresh;
		dashboard = event.data.dashboardId;
		WriteLog(INFO, "Dashboard - " + dashboard + " & RefreshEnabled - " + refreshQueueDashboard);

	}
});

function refreshQueueDashboardEvent() {

	if (refreshQueueDashboard && dashboard == 'DASHBOARD_003') {
		get_response_queue();
	}

	objTimeount = setTimeout(function () {
		refreshQueueDashboardEvent();
	}, autoRefreshTime * 1000);
}
/** * Event Listener to Dashboard Refresh - End */
