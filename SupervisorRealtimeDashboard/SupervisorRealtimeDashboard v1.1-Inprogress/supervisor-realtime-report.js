var _teamList = [];
var agentList_raw = {};
var agentList_new = {};
var _userDetails ={};
var refreshSupervisorDashboard = false;
var _teamGroupList=[];
var acmResponse = false;

$(document).ready(function(){
	//Custom Script For Table Sorting On Page Load - Start
	var tableID = "#tbl_performanceteam";
	$(tableID + ' th').each(function (col) {
		
		$(this).hover(
			function () {
				$(this).addClass('focus');
			},
			function () {
				$(this).removeClass('focus');
			}
		);
		$(this).click(function () {
			
			if ($(this).is('.asc')) {
				$(this).removeClass('asc');
				$(this).addClass('desc selected');
				sortOrder = -1;
			} else {
				$(this).addClass('asc selected');
				$(this).removeClass('desc');
				sortOrder = 1;
			}
			$(this).siblings().removeClass('asc selected');
			$(this).siblings().removeClass('desc selected');
			var arrData = $(tableID).find('tbody >tr:has(td)').get();
			arrData.sort(function (a, b) {
				var val1 = $(a).children('td').eq(col).text().toUpperCase();
				var val2 = $(b).children('td').eq(col).text().toUpperCase();
				if ($.isNumeric(val1) && $.isNumeric(val2))
					return sortOrder == 1 ? val1 - val2 : val2 - val1;
				else
					return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
			});
			$.each(arrData, function (index, row) {
				$(tableID + ' tbody').append((row));
			});
		});
	});
	//Custom Script For Table Sorting On Page Load - End
	//Custom Script For Table Sorting On Page Load - Start
	var tableID1 = "#tbl_agentdetails";
	$(tableID1 + ' th').each(function (col) {
		
		$(this).hover(
			function () {
				$(this).addClass('focus');
			},
			function () {
				$(this).removeClass('focus');
			}
		);
		$(this).click(function () {
			
			if ($(this).is('.asc')) {
				$(this).removeClass('asc');
				$(this).addClass('desc selected');
				sortOrder = -1;
			} else {
				$(this).addClass('asc selected');
				$(this).removeClass('desc');
				sortOrder = 1;
			}
			$(this).siblings().removeClass('asc selected');
			$(this).siblings().removeClass('desc selected');
			var arrData = $(tableID1).find('tbody >tr:has(td)').get();
			arrData.sort(function (a, b) {
				var val1 = $(a).children('td').eq(col).text().toUpperCase();
				var val2 = $(b).children('td').eq(col).text().toUpperCase();
				if ($.isNumeric(val1) && $.isNumeric(val2))
					return sortOrder == 1 ? val1 - val2 : val2 - val1;
				else
					return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
			});
			$.each(arrData, function (index, row) {
				$(tableID1 + ' tbody').append((row));
			});
		});
	});
	//Custom Script For Table Sorting On Page Load - End
	
});
$(document).on("click", ".tab-head-list li p[data-tab-index='1']", function() {
	//alert("Performance team");
	get_tbl_performanceteam_pos();
});
$(document).on("click", ".tab-head-list li p[data-tab-index='2']", function() {
	//alert("Agent Detail");
	get_tbl_agentdetails_pos()
});
$(document).on("click", ".tab-head-list li p[data-tab-index='3']", function() {
	//alert("Login summary");
	get_tbl_supervisorloginsummary_pos();
});

function get_tbl_supervisorloginsummary_pos() {
	var supervisorloginsummary_col_head = ".table-detail-container#tbl_supervisorloginsummary > thead > tr:first-child > th";
	supervisorloginsummary_col_body = ".table-detail-container#tbl_supervisorloginsummary > tbody > tr > td";
	supervisorloginsummary_col_foot = ".table-detail-container#tbl_supervisorloginsummary > tfoot > tr > td";
	
	supervisorloginsummary_colone_Width_val = $(supervisorloginsummary_col_head +":nth-of-type(1)").innerWidth();
	supervisorloginsummary_colone_Width = supervisorloginsummary_colone_Width_val + .5;
	console.log("col_one Width : " + supervisorloginsummary_colone_Width);
	supervisorloginsummary_coltwo_Width_val = $(supervisorloginsummary_col_head +":nth-of-type(2)").innerWidth();
	supervisorloginsummary_coltwo_Width = supervisorloginsummary_coltwo_Width_val + .5;
	console.log("col_two Width : " + supervisorloginsummary_coltwo_Width);
	supervisorloginsummary_col_left_val = supervisorloginsummary_colone_Width + supervisorloginsummary_coltwo_Width;
	console.log("col_three Val : " + supervisorloginsummary_col_left_val);
	
	$(supervisorloginsummary_col_head +":nth-of-type(1)").css("left", "-1px");
	$(supervisorloginsummary_col_body +":nth-of-type(1)").css("left", "-1px");
	$(supervisorloginsummary_col_foot +":nth-of-type(1)").css("left", "-1px");
	
	$(supervisorloginsummary_col_head +":nth-of-type(2)").css("left", supervisorloginsummary_colone_Width + "px");
	$(supervisorloginsummary_col_body +":nth-of-type(2)").css("left", supervisorloginsummary_colone_Width + "px");
	$(supervisorloginsummary_col_foot +":nth-of-type(2)").css("left", supervisorloginsummary_colone_Width + "px");
	
	$(supervisorloginsummary_col_head +":nth-of-type(3)").css("left", supervisorloginsummary_col_left_val + "px");
	$(supervisorloginsummary_col_body +":nth-of-type(3)").css("left", supervisorloginsummary_col_left_val + "px");
	$(supervisorloginsummary_col_foot +":nth-of-type(3)").css("left", supervisorloginsummary_col_left_val + "px");
}

function get_tbl_performanceteam_pos() {
	var performanceteam_col_head = ".table-detail-container#tbl_performanceteam > thead > tr:first-child > th";
	performanceteam_col_body = ".table-detail-container#tbl_performanceteam > tbody > tr > td";
	performanceteam_col_foot = ".table-detail-container#tbl_performanceteam > tfoot > tr > td";
	
	performanceteam_colone_Width_val = $(performanceteam_col_head +":nth-of-type(1)").innerWidth();
	performanceteam_colone_Width = performanceteam_colone_Width_val + .5;
	console.log("col_one Width : " + performanceteam_colone_Width);
	performanceteam_coltwo_Width_val = $(performanceteam_col_head +":nth-of-type(2)").innerWidth();
	performanceteam_coltwo_Width = performanceteam_coltwo_Width_val + .5;
	console.log("col_two Width : " + performanceteam_coltwo_Width);
	
	$(performanceteam_col_head +":nth-of-type(1)").css("left", "-1px");
	$(performanceteam_col_body +":nth-of-type(1)").css("left", "-1px");
	$(performanceteam_col_foot +":nth-of-type(1)").css("left", "-1px");
	
	$(performanceteam_col_head +":nth-of-type(2)").css("left", performanceteam_colone_Width + "px");
	$(performanceteam_col_body +":nth-of-type(2)").css("left", performanceteam_colone_Width + "px");
	$(performanceteam_col_foot +":nth-of-type(2)").css("left", performanceteam_colone_Width + "px");
}

function get_tbl_agentdetails_pos() {
	var agentdetails_col_head = ".table-detail-container#tbl_agentdetails > thead > tr:first-child > th";
	agentdetails_col_body = ".table-detail-container#tbl_agentdetails > tbody > tr > td";
	agentdetails_col_foot = ".table-detail-container#tbl_agentdetails > tfoot > tr > td";
	
	agentdetails_colone_Width_val = $(agentdetails_col_head +":nth-of-type(1)").innerWidth();
	agentdetails_colone_Width = agentdetails_colone_Width_val + .5;
	console.log("col_one Width : " + agentdetails_colone_Width);
	agentdetails_coltwo_Width_val = $(agentdetails_col_head +":nth-of-type(2)").innerWidth();
	agentdetails_coltwo_Width = agentdetails_coltwo_Width_val + .5;
	console.log("col_two Width : " + agentdetails_coltwo_Width);
	
	$(agentdetails_col_head +":nth-of-type(1)").css("left", "-1px");
	$(agentdetails_col_body +":nth-of-type(1)").css("left", "-1px");
	$(agentdetails_col_foot +":nth-of-type(1)").css("left", "-1px");
	
	$(agentdetails_col_head +":nth-of-type(2)").css("left", agentdetails_colone_Width + "px");
	$(agentdetails_col_body +":nth-of-type(2)").css("left", agentdetails_colone_Width + "px");
	$(agentdetails_col_foot +":nth-of-type(2)").css("left", agentdetails_colone_Width + "px");
}

function get_response_supervisor() {

	var queryParam = 'ALL';
	var serviceName = 'getAgentDashboardDetails';

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

function getACMUsersDetails() {
	WriteLog(INFO, "getACMUsersDetails - Start");
	acmUserDetails = [];

	var jsonRequest = {
		"api_url": "",
		"api_authorization": "Basic"
	}
	$.ajax({

		type: 'GET',
		url: CustomWidgetMiddleware + "/getACMUserDetails",
		type: 'POST',
		data: JSON.stringify(jsonRequest),
		cache: false,
		contentType: false,
		processData: false,
		headers:
		{
			"Accept": "application/json",
			"Content-Type": 'application/json',

		},
		success: function (data) {

			var _jsonData = data;
			
			for (var i = 0; i < _jsonData.value.length; i++) {
				var _agentId = _jsonData.value[i].UserName;
				var _agentData = _jsonData.value[i];
				acmUserDetails.push(_agentData);

			}
			//bindDropDownValues(acmUserDetails);
		},
		failure: function () {
			WriteLog(Error, "getACMUsersDetails - Failed Service Request");
		}
	});

	WriteLog(INFO, "getACMUsersDetails - End");
}

function getACMOceanaUsersDetails() {
	WriteLog(INFO, "getACMOceanaUsersDetails - Start");
	
	var jsonRequest = {
		"supervisorId": _supervisorId,
	}
	$.ajax({

		url: CustomWidgetMiddleware + "/getACMOceanaUsersDetails",
		type: 'POST',
		data: JSON.stringify(jsonRequest),
		cache: false,
		contentType: false,
		processData: false,
		headers:
		{
	
			"Accept": "application/json",
			"Content-Type": 'application/json',
		},
		success: function (response) {

			if(response != "FAILED") {
				var _jsonData = response;
				acmResponse = true;
				for (var i = 0; i < _jsonData.Groups.length; i++) {
					var _groupName = _jsonData.Groups[i].Name;
					supervisorGroups.push(_groupName);
				}
			} else {
				WriteLog(Error, "getACMOceanaUsersDetails - Failed Service Request");
			}
		},
		failure: function () {
			WriteLog(Error, "getACMOceanaUsersDetails - Failed Service Request");
		}
	});

	WriteLog(INFO, "getACMOceanaUsersDetails - End");
}

function getACMGroupDetails() {
	WriteLog(INFO, "getACMGroupDetails - Start");

	$.ajax({
		url: ACMAPIURL + "getGroupMapping",
		type: 'GET',		
		cache: false,
		contentType: false,
		processData: false,
		headers:
		{	
			"Accept": "application/json",
			"Content-Type": 'application/json',
		},
		success: function (data) {
			var _jsonData = data.response;
			acmGroupDetails = _jsonData;
		},
		failure: function () {
			WriteLog(Error, "getACMGroupDetails - Failed Service Request");
		}
	});	 

	WriteLog(INFO, "getACMGroupDetails - End");
}

function getACMAgentDetails() {
	WriteLog(INFO, "getACMAgentDetails - Start");

	$.ajax({
		url: ACMAPIURL + "getAgentMapping",
		type: 'GET',
		cache: false,
		contentType: false,
		processData: false,
		headers:
		{			
			"Accept": "application/json",
			"Content-Type": 'application/json',
		},
		success: function (data) {
			var _jsonData = data.response;
			acmUserDetails = _jsonData;
		},
		failure: function () {
			WriteLog(Error, "getACMAgentDetails - Failed Service Request");
		}
	});

	WriteLog(INFO, "getACMAgentDetails - End");
}

function load_data(obj_data) {	
	agentList_raw = bindAgentDashboardDetailList(obj_data);
	bindAgentDetailsTables(agentList_raw);
	agentList_new = alasql("SELECT * FROM ? ", [agentList_raw]);

}

function bindAgentDetailsTables(agentList_raw){
	var _tempPerformanceList = [];
	
	/*var _filterQuery =  "SELECT * FROM ? WHERE supervisorId = '" + _supervisorId +"'";
		var _supervisorDetails =  alasql(_filterQuery, [agentList_raw]); */
		if(ddlLoaded == false || acmResponse == true){
			//bindDropDownValues(_supervisorDetails);
			bindDropDownValues(agentList_raw);
		}

		var _query = "SELECT * FROM ? WHERE 1=1 ";

		if (supervisorGroups.length > 0 ) {
			var _groups = "  team LIKE '%" + supervisorGroups[0] + "%'"
	
			for (var i = 1; i < supervisorGroups.length; i++) {
				_groups += " OR team LIKE '%" +supervisorGroups[i] + "%'";
				
			}
			_query += " and (" + _groups + ")";
		}
		

		if ( _selectedTeam.length > 0 && _selectedTeam != '') {
			var _teamList = "  team LIKE '%" + _selectedTeam[0] + "%'"
	
			for (var i = 1; i < _selectedTeam.length; i++) {
				_teamList += " OR team LIKE '%" +_selectedTeam[i] + "%'";
				
			}
			_query += " and (" + _teamList + ")";

		}

		if (_selectedAgent != null && _selectedAgent.length > 0 && _selectedAgent.length != "0") {
			var _agentId = '';
			for (var i = 0; i < _selectedAgent.length; i++) {
				_agentId += "'" + _selectedAgent[i] + "',";
			}
			_query += " and agentId in (" + _agentId.slice(0, -1) + ")";

		}

		_query += "ORDER BY team";

		agentList = alasql(_query, [agentList_raw]);
		//Agent Details Table - Start
		$("#tbl_agentdetails > tbody").html("");

		var html = "";
		for (var a = 0; a < agentList.length; a++) {
			agentList1 = agentList[a];
			for (var i = 0; i < agentList1.accountDetails.length; i++) {
				if(_selectedTeam != "" && _selectedTeam != null && !_selectedTeam.includes(agentList1.accountDetails[i].team)){
					continue
				}

				_tempPerformanceList.push(agentList1.accountDetails[i]);

				if (agentList1.accountDetails[i].answered == 0) {
					continue;
				}

				html += "<tr class=\"parent service_" + i + "\" id=\'parent_" + i + "\'>";
				html += "<td class=\"table-tooltip\" data-label=\"AgentID\" >" + cleanHTML(agentList1.accountDetails[i].agentId) + "</td>";
				html += "<td class=\"table-tooltip\" data-label=\"AgentName\" >" + cleanHTML(agentList1.accountDetails[i].agentName) + "</td>";
				html += "<td class=\"table-tooltip\" data-label=\"Team\" >" + cleanHTML(agentList1.accountDetails[i].team) + "</td>";

				html += "<td class=\"table-tooltip\" data-label=\"Channel\" >" + cleanHTML(agentList1.accountDetails[i].channel) + "</td>";
				html += "<td class=\"perentCell align-center\" data-label=\"Answered\">" + cleanHTML(agentList1.accountDetails[i].answered) + "</td>";
				html += "<td class=\"perentCell align-center\" data-label=\"Completed\">" + cleanHTML(agentList1.accountDetails[i].complete) + "</td>";
				html += "<td class=\"perentCell align-center\" data-label=\"Deferred\">" + cleanHTML(agentList1.accountDetails[i].defered) + "</td>";


				html += "<td class=\"perentCell align-center\" data-label=\"AverageTalkTime\">" + cleanHTML(convert_time(agentList1.accountDetails[i].averageTalkTime)) + "</td>";
				html += "<td class=\"perentCell align-center\" data-label=\"AverageHoldTime\">" + cleanHTML(convert_time(agentList1.accountDetails[i].averageHoldTime)) + "</td>";
				html += "<td class=\"perentCell align-center\" data-label=\"AverageWrapTime\">" + cleanHTML(convert_time(agentList1.accountDetails[i].averageWrapTime)) + "</td>";
				html += "<td class=\"perentCell align-center\" data-label=\"AverageHandleTime\">" + cleanHTML(convert_time(agentList1.accountDetails[i].averageHandleTime)) + "</td>";
				html += "<td class=\"perentCell align-center hide\" data-label=\"Concurrency\">" + cleanHTML(agentList1.accountDetails[i].concurrency) + "</td>";
				html += "<td class=\"perentCell align-center hide\" data-label=\"OutboundCalls\" >" + cleanHTML(agentList1.accountDetails[i].outboundCalls) + "</td>";

				html += "<td class=\"perentCell align-center hide\" data-label=\"OutboundDuration\">" + cleanHTML(convert_time(agentList1.accountDetails[i].outboundDuration)) + "</td>";
				html += "<td class=\"perentCell align-center hide\" data-label=\"HoldCount\">" + cleanHTML(agentList1.accountDetails[i].holdCount) + "</td>";

				html += "<td class=\"perentCell align-center hide\" data-label=\"HoldDuration\">" + cleanHTML(convert_time(agentList1.accountDetails[i].holdDuration)) + "</td>";
				html += "<td class=\"perentCell align-center hide\" data-label=\"HoldDuration\">" + cleanHTML(convert_time(agentList1.accountDetails[i].totalLoginDuration)) + "</td>";
				html += "<td class=\"perentCell align-center hide\" data-label=\"HoldDuration\">" + cleanHTML(convert_time(agentList1.accountDetails[i].totalNotReadyDuration)) + "</td>";
				html += "<td class=\"perentCell align-center hide\" data-label=\"Occupancy\">" + cleanHTML(agentList1.accountDetails[i].occupancy) + "</td>";
				html += "</tr>";
			}
		}

		$('#tbl_agentdetails > tbody').append(html);

		//Custom Script For Table Sorting on Refresh - Start
		var tableID = "#tbl_agentdetails";
		if ($(tableID + " th").hasClass("asc")) {
			var tablecolnum = $(".asc");
			var col = $(tableID + " th").index(tablecolnum);
			sortOrder = 1;
			sortingjs();
		} else if ($(tableID + " th").hasClass("desc")) {
			var tablecolnum = $(".desc");
			var col = $(tableID + " th").index(tablecolnum);
			sortOrder = -1;
			sortingjs();
		};

		function sortingjs() {
			var arrData = $(tableID).find('tbody >tr:has(td)').get();
			arrData.sort(function (a, b) {
				var val1 = $(a).children('td').eq(col).text().toUpperCase();
				var val2 = $(b).children('td').eq(col).text().toUpperCase();
				if ($.isNumeric(val1) && $.isNumeric(val2))
					return sortOrder == 1 ? val1 - val2 : val2 - val1;
				else
					return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
			});
			$.each(arrData, function (index, row) {
				$(tableID + ' tbody').append((row));
			});
		};
		//Custom Script For Table Sorting on Refresh - End

		

		var _searchValue = $("#inputsearch_agentdetails").val();
		if(_searchValue != null && _searchValue != undefined && _searchValue != "") {
			$("#tbl_agentdetails tbody > tr").filter(function() {
				$(this).addClass('filtered-row').toggle($(this).text().toLowerCase().indexOf(_searchValue.toLowerCase()) > -1)
			});
		}

		$('#tbl_agentdetails > tfoot').html("");
		var result = [];
		$('#tbl_agentdetails tbody > tr').each(function () {
			var _style = $(this).css('display')
			if (_style != "none") {
				$('td', this).each(function (index, val) {
					if (!result[index])
						result[index] = 0;
					var _tdText = $(val).text() == '-' ? "0" : $(val).text();
					result[index] += cleanHTML(hhmmssTOseconds(_tdText));
				});
			}
		});

		result[0] = "Total";
		result[1] = "";
		result[2] = "";
		result[result.length - 1] = convert_time(result[result.length - 1]);

		$('#tbl_agentdetails > tfoot').append(('<tr></tr>'));
		$(result).each(function () {
			$('#tbl_agentdetails tfoot tr').append(('<td class=\"align-center\">' + this + '</td>'))
		});
		//Agent Details Table - End
		get_tbl_agentdetails_pos();

		//Performance Details Table - Start
		var _query = "SELECT channel, team, SUM(answered) as answered, SUM(averageTalkTime) as averageTalkTime,"
			+ "SUM(averageHoldTime) as averageHoldTime, SUM(averageWrapTime) as averageWrapTime,"
			+ "SUM(averageHandleTime) as averageHandleTime, SUM(concurrency::decimal(10,2)) as concurrency,"
			+ "SUM(outboundCalls) as outboundCalls, SUM(outboundDuration) as outboundDuration,"
			+ "SUM(transferredAccepted) as transferredAccepted, SUM(transferredInitiated) as transferredInitiated, SUM(acw) as acw,"
			+ "SUM(holds) as holds, SUM(activeTimeDuration) as activeTimeDuration,SUM(acwDuration) as acwDuration,"
			+ "SUM(consultInitiatedToService) as consultInitiatedToService,SUM(consultAcceptedFromService) as consultAcceptedFromService,"
			+ "SUM(holdCount) as holdCount, SUM(holdDuration) as holdDuration FROM ? GROUP BY channel, team ORDER By team";

		var performanceDetailsList = alasql(_query, [_tempPerformanceList]);

		var _totalFilterQuery = "SELECT SUM(answered) as answered, "
			+ "SUM(transferredAccepted) as transferredAccepted, SUM(transferredInitiated) as transferredInitiated, SUM(acw) as acw,"
			+ "SUM(holds) as holds, SUM(activeTimeDuration) as activeTimeDuration,"
			+ "SUM(acwDuration) as acwDuration, SUM(holdDuration) as holdDuration FROM ? ";

		var totalList = alasql(_totalFilterQuery, [_tempPerformanceList]);


		$("#tbl_performanceteam > tbody").html("");
		var html_interaction = "";
		//for (var b = 0; b < performanceDetailsList.length; b++) {
		//agentList2 = agentList[b];
		for (var j = 0; j < performanceDetailsList.length; j++) {

			if (performanceDetailsList[j].answered == 0 && performanceDetailsList[j].outboundCalls == 0) {
				continue;
			}

			html_interaction += "<tr class=\"parent service_" + j + "\" id=\'parent_" + j + "\'>";
			html_interaction += "<td class=\"table-tooltip\" data-label=\"Team\" >" + cleanHTML(performanceDetailsList[j].team) + "</td>";
			html_interaction += "<td class=\"table-tooltip\" data-label=\"Channel\" >" + cleanHTML(performanceDetailsList[j].channel) + "</td>";
			html_interaction += "<td class=\"perentCell align-center\" data-label=\"Answered\">" + cleanHTML(performanceDetailsList[j].answered) + "</td>";
			html_interaction += "<td class=\"perentCell align-center\" data-label=\"AverageTalkTime\">" + cleanHTML(calculateAverageTalkTime(performanceDetailsList[j])) + "</td>";
			html_interaction += "<td class=\"perentCell align-center\" data-label=\"AverageHoldTime\">" + cleanHTML(calculateAverageHoldTime(performanceDetailsList[j])) + "</td>";
			html_interaction += "<td class=\"perentCell align-center\" data-label=\"AverageWrapTime\">" + cleanHTML(calculateAverageWrapTime(performanceDetailsList[j])) + "</td>";
			html_interaction += "<td class=\"perentCell align-center\" data-label=\"AverageHandleTime\">" + cleanHTML(calculateAverageHandleTime(performanceDetailsList[j])) + "</td>";
			html_interaction += "<td class=\"perentCell align-center\" data-label=\"Transfer Initiated\" >" + cleanHTML(performanceDetailsList[j].transferredInitiated) + "</td>";
			html_interaction += "<td class=\"perentCell align-center\" data-label=\"Transfer Accepted\" >" + cleanHTML(performanceDetailsList[j].transferredAccepted) + "</td>";
			html_interaction += "<td class=\"perentCell align-center\" data-label=\"Consult Initiated\" >" + cleanHTML(performanceDetailsList[j].consultInitiatedToService) + "</td>";
			html_interaction += "<td class=\"perentCell align-center\" data-label=\"Consult Accepted\" >" + cleanHTML(performanceDetailsList[j].consultAcceptedFromService) + "</td>";

			//html_interaction += "<td class=\"perentCell align-center \" data-label=\"AverageHoldTime\">" + (performanceDetailsList[j].concurrency).toFixed(2) + "</td>";
			//html_interaction += "<td class=\"perentCell align-center hide\" data-label=\"Concurrency\">NA</td>";
			html_interaction += "<td class=\"perentCell align-center \" data-label=\"OutboundCalls\" >" + cleanHTML(performanceDetailsList[j].outboundCalls) + "</td>";

			html_interaction += "<td class=\"perentCell align-center \" data-label=\"OutboundDuration\">" + cleanHTML(convert_time(performanceDetailsList[j].outboundDuration)) + "</td>";
			html_interaction += "<td class=\"perentCell align-center \" data-label=\"HoldCount\">" + cleanHTML(performanceDetailsList[j].holdCount) + "</td>";
			html_interaction += "<td class=\"perentCell align-center \" data-label=\"HoldDuration\">" + cleanHTML(convert_time(performanceDetailsList[j].holdDuration)) + "</td>";
			html_interaction += "</tr>";
		}
		//}
		$('#tbl_performanceteam > tbody').append((html_interaction));

		//Custom Script For Table Sorting on Refresh - Start
		var tableID = "#tbl_performanceteam";
		if ($(tableID + " th").hasClass("asc")) {
			var tablecolnum = $(".asc");
			var col = $(tableID + " th").index(tablecolnum);
			sortOrder = 1;
			sortingjs();
		} else if ($(tableID + " th").hasClass("desc")) {
			var tablecolnum = $(".desc");
			var col = $(tableID + " th").index(tablecolnum);
			sortOrder = -1;
			sortingjs();
		};

		function sortingjs() {
			var arrData = $(tableID).find('tbody >tr:has(td)').get();
			arrData.sort(function (a, b) {
				var val1 = $(a).children('td').eq(col).text().toUpperCase();
				var val2 = $(b).children('td').eq(col).text().toUpperCase();
				if ($.isNumeric(val1) && $.isNumeric(val2))
					return sortOrder == 1 ? val1 - val2 : val2 - val1;
				else
					return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
			});
			$.each(arrData, function (index, row) {
				$(tableID + ' tbody').append((row));
			});
		};
		//Custom Script For Table Sorting on Refresh - End

		

		var _searchValue = $("#inputsearch_performanceteam").val();
		if(_searchValue != null && _searchValue != undefined && _searchValue != "") {
			$("#tbl_performanceteam tbody > tr").filter(function() {
				$(this).addClass('filtered-row').toggle($(this).text().toLowerCase().indexOf(_searchValue.toLowerCase()) > -1)
			});
		}

		$('#tbl_performanceteam > tfoot').html("");
		var result1 = [];
		$('#tbl_performanceteam tbody > tr').each(function () {
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

		result1[0] = "Total";
		result1[1] = "";
		result1[result1.length - 1] = convert_time(result1[result1.length - 1]);
		result1[result1.length - 3] = convert_time(result1[result1.length - 3]);
		//result1[result1.length - 5] = (result1[result1.length - 5]).toFixed(2);
		//result1[result1.length - 5] = "NA";
		//result1[result1.length - 6] = convert_time(result1[result1.length - 6]);
		result1[result1.length - 9] = calculateAverageHandleTime(totalList[0]);
		result1[result1.length - 10] = calculateAverageWrapTime(totalList[0]);
		result1[result1.length - 11] = calculateAverageHoldTime(totalList[0]);
		result1[result1.length - 12] = calculateAverageTalkTime(totalList[0]);

		$('#tbl_performanceteam > tfoot').append(('<tr></tr>'));
		$(result1).each(function () {
			$('#tbl_performanceteam tfoot tr').append(('<td class=\"align-center\">' + this + '</td>'))
		});
		//Interaction Details Table - End
		get_tbl_performanceteam_pos();
		//AUX Summary Table - Start

		$("#tbl_supervisorloginsummary > thead").html("");

		var html_head = "";
		var html_head_child = "";
		html_head_child += " <tr class=\"child-head\">";
		html_head += " <tr>";
		html_head += " <th class=\"sorting1\" rowspan=\"2\">Agent ID</th>";
		html_head += " <th class=\"sorting1\" rowspan=\"2\">Agent Name</th>";
		html_head += " <th class=\"sorting1\" rowspan=\"2\">Team</th>";		
		html_head += " <th class=\"sorting1\" rowspan=\"2\">Current State</th>";
		html_head += " <th class=\"sorting1\" rowspan=\"2\">Current State Duration</th>";
		html_head += " <th class=\"sorting1\" rowspan=\"2\">Login Duration</th>";
		html_head += " <th class=\"sorting1\" rowspan=\"2\">Total Not Ready Duration</th>";
		html_head += " <th class=\"sorting1\" rowspan=\"2\">Total Idle Duration</th>";
		html_head += " <th class=\"sorting1\" rowspan=\"2\" >Not Ready %</th>";
		html_head += " <th class=\"sorting1\" rowspan=\"2\" >Additional Work</th>";
		html_head += " <th class=\"sorting1\" rowspan=\"2\" >Additional Work Duration</th>";
		for (var n = 0; n < auxCodeDetails.length; n++) {
			html_head += " <th colspan=\"2\" class=\"align-center\"> " + cleanHTML(auxCodeDetails[n].codeName) + "</th>";
			html_head_child += "<th class=\"sorting1\">Count</th><th class=\"sorting1\">Duration</th>";
		}

		html_head += " </tr>";
		html_head_child += " </tr>";

		html_head += html_head_child;
		$("#tbl_supervisorloginsummary > thead").append((html_head));


		$("#tbl_supervisorloginsummary > tbody").html("");
		var html_aux = "";

		for (var c = 0; c < agentList.length; c++) {

			if(_selectedState != "" && _selectedState != null && !_selectedState.includes(agentList[c].agentState))
				continue;

			html_aux += "<tr class=\"parent service_" + c + "\" id=\'parent_" + c + "\'>";
			html_aux += "<td class=\"perentCell \" data-label=\"AgentID\">" + cleanHTML(agentList[c].agentId) + "</td>";
			html_aux += "<td class=\"perentCell \" data-label=\"AgentName\">" + cleanHTML(agentList[c].agentDisplayName) + "</td>";
			html_aux += "<td class=\"perentCell \" data-label=\"Team\">" + cleanHTML(agentList[c].team) + "</td>";
			html_aux += "<td class=\"perentCell align-center\" data-label=\"AgentState\">" + cleanHTML(agentList[c].agentState) + "</td>";
			html_aux += "<td class=\"perentCell align-center\" data-label=\"CurrentStateDuration\">" + cleanHTML(agentList[c].currentStateDuration) + "</td>";
			html_aux += "<td class=\"perentCell align-center\" data-label=\"TotalLoginDuration\">" + cleanHTML(agentList[c].totalLoginDuration) + "</td>";
			html_aux += "<td class=\"perentCell align-center\" data-label=\"TotalNotReadyDuration\">" + cleanHTML(agentList[c].totalNotReadyDuration) + "</td>";
			html_aux += "<td class=\"perentCell align-center\" data-label=\"TotalIdleDuration\">" + cleanHTML(agentList[c].totalIdleDuration) + "</td>";
			html_aux += "<td class=\"perentCell align-center\" data-label=\"notReadyPercentage\">" + cleanHTML(agentList[c].notReadyPercentage) + "</td>";
			html_aux += "<td class=\"perentCell align-center\" data-label=\"additionalwork\">" + cleanHTML(agentList[c].agentadditionalWork) + "</td>";
			html_aux += "<td class=\"perentCell align-center\" data-label=\"additionalwork\">" + cleanHTML(agentList[c].agentadditionalWorkDuration) + "</td>";

			var _auxCode = agentList[c].auxDetailsList;
			for (var k = 0; k < auxCodeDetails.length; k++) {
				var _auxDetails = _auxCode.find(obj => obj.auxCode == auxCodeDetails[k].code)

				html_aux += "<td class=\"perentCell align-center\" data-label=\"AuxCount\">" + (_auxDetails == undefined ? "0" : cleanHTML(_auxDetails.auxCount)) + "</td>";
				html_aux += "<td class=\"perentCell align-center\" data-label=\"AuxDuration\">" + (_auxDetails == undefined ? "00:00:00" : cleanHTML(_auxDetails.auxDuration)) + "</td>";

			}
			html_aux += "</tr>";
		}
		$('#tbl_supervisorloginsummary > tbody').append((html_aux));


		//Custom Script For Table Sorting On Page Load - Start
//// ADDED tableID2 here 
var tableID2 = "#tbl_supervisorloginsummary";
$(tableID2 + ' th.sorting').each(function (col) {
	//alert("test");
	
	//// ADDED tableID2 here 
	$(document).on("mouseenter", tableID2 +  " .sorting", this, function () {
			$(this).addClass('focus');
		}),
		$(document).on("mouseleave", ".sorting", this, function () {
			$(this).removeClass('focus');
		});
		//// ADDED tableID2 here 
	$(document).on("click", tableID2 +  " .sorting", this, function () {
	//$(tableID2 +  ".sorting", this).click(function () {

		if ($(this).is('.asc')) {
			$(this).removeClass('asc');
			$(this).addClass('desc selected');
			sortOrder = -1;
		} else {
			$(this).addClass('asc selected');
			$(this).removeClass('desc');
			sortOrder = 1;
		}
		$(this).siblings().removeClass('asc').removeClass('selected');
		$(this).siblings().removeClass('desc').removeClass('selected');
		//// ADDED tableID2 here 
		var arrData = $(tableID2).find('tbody >tr:has(td)').get();
		arrData.sort(function (a, b) {
			var val1 = $(a).children('td').eq(col).text().toUpperCase();
			var val2 = $(b).children('td').eq(col).text().toUpperCase();
			if ($.isNumeric(val1) && $.isNumeric(val2))
				return sortOrder == 1 ? val1 - val2 : val2 - val1;
			else
				return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
		});
		$.each(arrData, function (index, row) {
			//// ADDED tableID2 here 
			$(tableID2 + ' tbody').append((row));
		});
	});
});
//Custom Script For Table Sorting On Page Load - End
//Custom Script For Table Sorting on Refresh - Start
		//var tableID = "#tbl_supervisorloginsummary";

		// //// ADDED tableID2 here 
		// if ($(tableID2 + " th").hasClass("asc")) {
			// alert("test");
			// var tablecolnum = $(".asc");
			// //// ADDED tableID2 here 
			// var col = $(tableID2 + " th").index(tablecolnum);
			// sortOrder = 1;
			// sortingjs();
		// } else if ($(tableID2 + " th").hasClass("desc")) {
			// var tablecolnum = $(".desc");
			// var col = $(tableID2 + " th").index(tablecolnum);
			// sortOrder = -1;
			// sortingjs();
		// };

		// function sortingjs() {
			// var arrData = $(tableID2).find('tbody >tr:has(td)').get();
			// arrData.sort(function (a, b) {
				// var val1 = $(a).children('td').eq(col).text().toUpperCase();
				// var val2 = $(b).children('td').eq(col).text().toUpperCase();
				// if ($.isNumeric(val1) && $.isNumeric(val2))
					// return sortOrder == 1 ? val1 - val2 : val2 - val1;
				// else
					// return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
			// });
			// $.each(arrData, function (index, row) {
				// //// ADDED tableID2 here 
				// $(tableID2 + ' tbody').append((row));
			// });
			
		// };
		//Custom Script For Table Sorting on Refresh - End

		var _searchValue = $("#inputsearch_supervisorloginsummary").val();
		if(_searchValue != null && _searchValue != undefined && _searchValue != "") {
			$("#tbl_supervisorloginsummary tbody > tr").filter(function() {
				$(this).addClass('filtered-row').toggle($(this).text().toLowerCase().indexOf(_searchValue.toLowerCase()) > -1)
			});
		}

		$('#tbl_supervisorloginsummary > tfoot').html("");
		var result2 = [];
		$('#tbl_supervisorloginsummary tbody > tr').each(function () {
			var _style = $(this).css('display')
			if (_style != "none") {
				$('td', this).each(function (index, val) {
					if (!result2[index])
						result2[index] = 0;
					var _tdText = $(val).text() == '-' ? 0 : $(val).text();
					result2[index] += cleanHTML(hhmmssTOseconds(_tdText));
				});
			}
		});

		result2[0] = "Total";
		result2[1] = "";
		result2[2] = "";
		result2[result1.length - 1] = convert_time(result2[result2.length - 1]);

		$('#tbl_supervisorloginsummary > tfoot').append(('<tr></tr>'));
		$(result2).each(function () {
			$('#tbl_supervisorloginsummary tfoot tr').append(('<td class=\"align-center\">' + this + '</td>'))
		});
		//AUX Summary Table - End
		get_tbl_supervisorloginsummary_pos();
}

	
function bindDropDownValues(_supervisorDetails) {

	//var _supervisorQuery = "SELECT DISTINCT team FROM ? WHERE supervisorId = '" + _supervisorId + "'";
	
	var _groups = '';
	var _groupList = '';
	var _groupQuery='';
	if (supervisorGroups.length > 0) {
		
		_groups += " WHERE team LIKE '%" + supervisorGroups[0] + "%'"
		for (var i = 1; i < supervisorGroups.length; i++) {
			_groups += " OR team LIKE '%" +supervisorGroups[i] + "%'";
			
		}

	}
	var _agentTeamQuery = "SELECT agentId, agentDisplayName, team FROM ? " +_groups+ " ORDER by agentId";


	//var _supervisorTeam = alasql(_supervisorQuery, [_supervisorDetails]);
	
	var _groupDetailsQuery = "SELECT distinct team FROM ? ORDER by team";
	//var _supervisorTeam = alasql(_supervisorQuery, [_supervisorDetails]);
	_teamList = alasql(_agentTeamQuery, [_supervisorDetails]);
	
	
	var _accountDetailsQuery = "SELECT accountDetails FROM ?";
	//var _supervisorTeam = alasql(_supervisorQuery, [_supervisorDetails]);
	//var _accountList = alasql(_accountDetailsQuery, [_supervisorDetails]);
	//var _accountList1 = alasql(_accountDetailsQuery, [_accountList]);
	//_groupList = alasql(_groupDetailsQuery, [_accountList]);

	if(supervisorGroups.length == 0 ) {
		_teamGroupList.sort();
		if (_teamGroupList != '' && _teamGroupList != null && _teamGroupList.length > 0) {
			$('#ddlSelectTeam').empty();
			
			for (var i = 0; i < _teamGroupList.length; i++) {
				var _groupName = cleanHTML(_teamGroupList[i]);
				$('#ddlSelectTeam').append((
					"<option value='" + _groupName + "'>" + _groupName + "</option>"));		
			}
		}
	}
	else{
		supervisorGroups.sort();
		if (supervisorGroups.length > 0) {
			$('#ddlSelectTeam').empty();
			
			for (var i = 0; i < supervisorGroups.length; i++) {
				var _groupName = cleanHTML(supervisorGroups[i]);
				$('#ddlSelectTeam').append((
					"<option value='" + _groupName + "'>" + _groupName + "</option>"));		
			}
		}
	}
	
	$('#ddlSelectTeam').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        onChange: function (element, checked) {
           // var _teams = $('#ddlSelectTeam option:selected');
			_selectedTeam=$('#ddlSelectTeam').val();
            bindAgentDropdown(_selectedTeam);
		},
		onSelectAll: function () {
			_selectedTeam = [];
			bindAgentDropdown(_selectedTeam);
		},
		onDeselectAll: function () {
			_selectedTeam = [];
			bindAgentDropdown(_selectedTeam);
		}
	});

	if(_teamList.length == 0)
		return;

	$('#ddlSelectAgent').empty();

	if (_teamList != undefined) {
		for (var j = 0; j < _teamList.length; j++) {

			$('#ddlSelectAgent').append((
				"<option value='" + cleanHTML(_teamList[j].agentId) + "'>" + cleanHTML(_teamList[j].agentDisplayName) + "</option>"));
		}
	}
	$('#ddlSelectAgent').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
		buttonWidth: '100%',
		onChange: function (element, checked) {
            _selectedAgent = $('#ddlSelectAgent').val();
		},
		onSelectAll: function () {
			_selectedAgent = [];
			
		},
		onDeselectAll: function () {
			_selectedAgent = [];
			
		}
	});

	$('#ddlChannelState').empty();

	if (agentStateList != undefined) {
		$.each(agentStateList, function (key, value) {
			$("#ddlChannelState").append($("<option></option>").val(key).text(value));

		});
	}
	$('#ddlChannelState').multiselect({
		includeSelectAllOption: true,
		enableFiltering: true,
		enableCaseInsensitiveFiltering: true,
		buttonWidth: '100%',
		onChange: function (element, checked) {
            _selectedState = $('#ddlChannelState').val();
		},
		onSelectAll: function () {
			_selectedState = [];
			
		},
		onDeselectAll: function () {
			_selectedState = [];
			
		}
	});
	ddlLoaded = true;
	if(acmResponse == true)
		acmResponse =false;

}

function bindAgentDropdown(_team) {
	var _selectedAgent ='';
	var _teamFilterQuery='';
	var _teamArray= _team; //.split(',');
	if (_teamArray.length > 0) {

		_teamFilterQuery += " WHERE team LIKE '%" + _teamArray[0] + "%'"
		for (var i = 1; i < _teamArray.length; i++) {
			_teamFilterQuery += " OR team LIKE '%" +_teamArray[i] + "%'";
			
		}

	}

	var _agentTeamQuery = "SELECT agentId,agentDisplayName, team FROM ? "+ _teamFilterQuery +" ORDER by agentId";

	var _teamList2 = alasql(_agentTeamQuery, [_teamList]);

	$('#ddlSelectAgent').html("");
	
	if (_teamList2 != undefined) {
		//$('#ddlSelectAgent').append(
		//	"<option value=\"0\">ALL</option>");
		for (var j = 0; j < _teamList2.length; j++) {
			$('#ddlSelectAgent').append((
				"<option value='" + cleanHTML(_teamList2[j].agentId) + "'>" + cleanHTML(_teamList2[j].agentDisplayName) + "</option>"));
		}

		$('#ddlSelectAgent').multiselect('rebuild');
	}

	
}

function bindAgentDashboardDetailList(agentList) {
	var _list = [];
	var _accountList = [];
	var _serviceList = [];
	var _auxList = [];

	for (var i = 0; i < agentList.length; i++) {

		if (agentList[i] == null || agentList[i] == undefined) {
			return _list;
		}
		var _jsonValues = JSON.parse(agentList[i].agentMeasures);

		//_userDetails = acmUserDetails.find(obj => obj.UserName == agentList[i].agentId);
		if(acmUserDetails != undefined &&acmUserDetails!=null)
			_userDetails = acmUserDetails.find(obj => obj.agentId == agentList[i].agentId);
		else{
			//getACMOceanaUsersDetails();
		}
			
		var _jsonAccountList = agentList[i].agentAccountMeasures;
		if (_jsonAccountList != null || _jsonAccountList != undefined) {
			_accountList = [];
			for (var j = 0; j < _jsonAccountList.length; j++) {
				var _jsonAccountValues = JSON.parse(_jsonAccountList[j].accountMeasures);

				var _channel = '';
				if (_jsonAccountValues.channelName == undefined && _jsonAccountValues.routingAttributeService != undefined) {
					var _attributes = _jsonAccountValues.routingAttributeService.split("|");
					for (var attribute of _attributes) {
						_channel = attribute.split(".")[1];
						break;
					}
				}

				if (_jsonAccountValues != null && _jsonAccountValues != undefined && _userDetails != undefined ) {
				//if (_jsonAccountValues != null && _jsonAccountValues != undefined && _userDetails != undefined ) {
		
					var _answeredContacts = (_jsonAccountValues.answered == undefined ? 0 : _jsonAccountValues.answered + (_jsonAccountValues.transferredAccepted == undefined ? 0 : _jsonAccountValues.transferredAccepted));
					if(_userDetails.groupName != undefined) {
					for(var a=0; a < _userDetails.groupName.length; a++ ) {
						
						var _lteam = _userDetails == undefined ? 'Others' : _userDetails.groupName[a];
						if(!_teamGroupList.includes(_lteam))
							_teamGroupList.push(_lteam);
						var accountDetails = {
							team: _userDetails == undefined ? 'Others' : _userDetails.groupName[a],
							agentId: _jsonAccountValues.agentId == undefined ? '-' : _jsonAccountValues.agentId,
							agentName: _jsonAccountValues.agentDisplayName == undefined ? '-' : _jsonAccountValues.agentDisplayName,
							channel: _jsonAccountValues.channelName == undefined ? _channel : _jsonAccountValues.channelName,
							answered: _jsonAccountValues.answered == undefined ? 0 : _jsonAccountValues.answered,
							averageTalkTime: (((_answeredContacts == 0 || _jsonAccountValues.activeTimeDuration == undefined) ? 0 : (_jsonAccountValues.activeTimeDuration / (_answeredContacts)))),
							
							
							averageHoldTime: (((_jsonAccountValues.holds == undefined || _jsonAccountValues.holdDuration==undefined) ? 0 : (_jsonAccountValues.holdDuration / _answeredContacts))),
							averageWrapTime: (((_jsonAccountValues.acw == undefined || _jsonAccountValues.acwDuration ==undefined) ? 0 : (_jsonAccountValues.acwDuration / _answeredContacts))),
							averageHandleTime: (((_answeredContacts == 0 || _jsonAccountValues.activeTimeDuration == undefined) ? 0 : (_jsonAccountValues.activeTimeDuration / (_answeredContacts)))
								+ ((_jsonAccountValues.holds == undefined || _jsonAccountValues.holds == 0 || _jsonAccountValues.holdDuration == undefined) ? 0 : (_jsonAccountValues.holdDuration / _answeredContacts))
								+ ((_jsonAccountValues.acw == undefined || _jsonAccountValues.acw == 0 || _jsonAccountValues.acwDuration == undefined) ? 0 : (_jsonAccountValues.acwDuration / _answeredContacts))),
						
							concurrency: calculateConcurrency(_jsonAccountValues, _jsonValues),
							outboundCalls: _jsonAccountValues.personalOutboundContacts == undefined ? 0 : _jsonAccountValues.personalOutboundContacts,
							outboundDuration: (_jsonAccountValues.personalOutboundDuration == undefined ? 0 : _jsonAccountValues.personalOutboundDuration),
							holdCount: _jsonAccountValues.holds == undefined ? 0 : _jsonAccountValues.holds,
							holdDuration: (_jsonAccountValues.holdDuration == undefined ? 0 : _jsonAccountValues.holdDuration),
							occupancy: calculateOccupancy(_jsonAccountValues, _jsonValues.agentState, _jsonValues.loginTimeStamp, _jsonValues),
							totalLoginDuration: (_jsonAccountValues.accountLogonDuration),
							totalNotReadyDuration: (_jsonAccountValues.accountNotReadyTimeDuration), //agentNotReadyTimeDuration
							transferredInitiated: _jsonAccountValues.transferredInitiated == undefined ? 0 : _jsonAccountValues.transferredInitiated,
							transferredAccepted: _jsonAccountValues.transferredAccepted == undefined ? 0 : _jsonAccountValues.transferredAccepted,
							activeTimeDuration: _jsonAccountValues.activeTimeDuration == undefined ? 0 : _jsonAccountValues.activeTimeDuration,
							acwDuration: _jsonAccountValues.acwDuration == undefined ? 0 : _jsonAccountValues.acwDuration,
							acw: _jsonAccountValues.acw == undefined ? 0 : _jsonAccountValues.acw,
							holdDuration: _jsonAccountValues.holdDuration == undefined ? 0 : _jsonAccountValues.holdDuration,
							holds: _jsonAccountValues.holds == undefined ? 0 : _jsonAccountValues.holds,
							accountId: _jsonAccountList[j].accountId == undefined ? '-' : _jsonAccountList[j].accountId,
							rountingService: _jsonAccountValues.routingAttributeService == undefined ? '-' : _jsonAccountValues.routingAttributeService,
							complete: (_jsonAccountValues.completed == undefined ? 0 : _jsonAccountValues.completed),
							defered: (_jsonValues.deferredContacts == undefined ? 0 :_jsonValues.deferredContacts),
							consultInitiatedToService: (_jsonAccountValues.consultsInitiatedToService == undefined ? 0 :parseInt(_jsonAccountValues.consultsInitiatedToService)),
							consultAcceptedFromService: (_jsonAccountValues.consultsAcceptedFromService == undefined ? 0 :parseInt(_jsonAccountValues.consultsAcceptedFromService)),				
							accountState: _jsonAccountValues.accountState == undefined ? '-' : _jsonAccountValues.accountState
						}
						_accountList.push(accountDetails);
					}
					}
				}
			}
		}


		var _performanceList = '';

		var _jsonAuxList = agentList[i].agentAUXCodeMeasures;
		if (_jsonAuxList != null || _jsonAuxList != undefined) {
			_auxList = [];
			for (var l = 0; l < _jsonAuxList.length; l++) {
				var _jsonAuxValues = JSON.parse(_jsonAuxList[l].auxMeasureData);
				if (_jsonAuxValues != null || _jsonAuxValues != undefined) {

					var _duration = (_jsonAuxValues.agentNRReasonCodeTimeDuration == undefined ? 0 : _jsonAuxValues.agentNRReasonCodeTimeDuration);

					var auxDetails = {
						auxCode: _jsonAuxValues.nrReasonCode,
						auxName: _jsonAuxValues.nrReasonCodeName,
						auxCount: (_jsonAuxValues.nrReasonCodeOccurrence == undefined ? 0 : _jsonAuxValues.nrReasonCodeOccurrence),
						auxDuration: calculateAgentNotReadyDuration(_duration, _jsonAuxValues.nrReasonCodeEffectiveDT, _jsonValues.agentState, _jsonValues.nrReasonCode, _jsonAuxValues.nrReasonCode),

					}
					_auxList.push(auxDetails);
				}
			}
		}

		var _agentMeasures = JSON.parse(agentList[i].agentMeasures);

		var agentDetails = {
			agentDisplayName: _jsonValues.agentDisplayName == undefined ? '-' : _jsonValues.agentDisplayName,
			agentId: _jsonValues.agentId == undefined ? '-' : _jsonValues.agentId,
			agentState: _jsonValues.agentState == undefined ? '-' : _jsonValues.agentState,
			currentStateDuration: calculateAgentStateDuration(_agentMeasures.lastStateChangeUserTimestamp,_jsonValues.agentState),
			totalLoginDuration: calculateAgentLogonDuration(_agentMeasures.agentLogonDuration, _agentMeasures.loginTimeStamp, _jsonValues.agentState),
			totalNotReadyDuration: convert_time(_agentMeasures.agentNotReadyTimeDuration == undefined ? 0 : _agentMeasures.agentNotReadyTimeDuration), //agentNotReadyTimeDuration
			totalIdleDuration: convert_time(_agentMeasures.idleTimeDuration == undefined ? 0 : _agentMeasures.idleTimeDuration),
			notReadyPercentage: calculateAgentNotReadyPercentage(_agentMeasures),
			//team: _userDetails == undefined ? '-' : _userDetails.Team,
			team: (_userDetails == undefined)? '-' : ((_userDetails.groupName == undefined) ? '-' : _userDetails.groupName.toString()),
			supervisorId: _agentMeasures.supervisorId == undefined ? '-' : _agentMeasures.supervisorId,
			agentadditionalWork: _jsonValues.additionalWork == undefined ? 0 : _jsonValues.additionalWork,
			agentadditionalWorkDuration: convert_time(_jsonValues.additionalWorkDuration == undefined ? 0 : _jsonValues.additionalWorkDuration),
			accountDetails: _accountList,
			performanceDetailsList: _performanceList,
			auxDetailsList: _auxList,
		}
		_list.push(agentDetails);
	}
	return _list;
}

function calculateAgentStateDuration(_jsonVal,agentState) {
	var _timeStamp = '';
	if (_jsonVal == undefined || _jsonVal == "0" || agentState == undefined || agentState == "LOGGED_OUT") {
		return "00:00:00";
	}

	var startDate = new Date(parseInt(_jsonVal));
	var endDate = new Date();
	var num = (endDate.getTime() - startDate.getTime()) / 1000;

	return convert_time(num);

}

function calculateAverageTalkTime(agentList) {

	var _activeTime = parseInt(agentList.activeTimeDuration == undefined ? 0 : agentList.activeTimeDuration);
	var _totalAnswered = parseInt(agentList.answered == undefined ? 0 : agentList.answered) + parseInt(agentList.transferredAccepted == undefined ? 0 : agentList.transferredAccepted)

	var _avgTalk = (_totalAnswered == 0 ? 0 : (parseInt(_activeTime) / _totalAnswered));
	return convert_time(_avgTalk);
}


function calculateAverageWrapTime(agentList) {

	var _acwTime = parseInt(agentList.acwDuration == undefined ? 0 : agentList.acwDuration);
	var _totalAcw = parseInt(agentList.answered == undefined ? 0 : agentList.answered) + parseInt(agentList.transferredAccepted == undefined ? 0 : agentList.transferredAccepted)

	var _avgWrap = (_totalAcw == 0 ? 0 : (parseInt(_acwTime) / _totalAcw));

	return convert_time(_avgWrap);
}


function calculateAverageHoldTime(agentList) {

	var _holdTime = parseInt(agentList.holdDuration == undefined ? 0 : agentList.holdDuration);
	var _totalHolds = parseInt(agentList.answered == undefined ? 0 : agentList.answered) + parseInt(agentList.transferredAccepted == undefined ? 0 : agentList.transferredAccepted)

	var _avgHold = (_totalHolds == 0 ? 0 : (parseInt(_holdTime) / _totalHolds));
	return convert_time(_avgHold);
}

function calculateAverageHandleTime(agentList) {

	var _activeTime = (agentList.activeTimeDuration == undefined ? 0 : agentList.activeTimeDuration);
	var _acwTime = (agentList.acwDuration == undefined ? 0 : agentList.acwDuration);
	var _holdTime = (agentList.holdDuration == undefined ? 0 : agentList.holdDuration);
	var _totalAnswered = parseInt(agentList.answered == undefined ? 0 : agentList.answered) + parseInt(agentList.transferredAccepted == undefined ? 0 : agentList.transferredAccepted)
	var _totalAcw = parseInt(agentList.acw == undefined ? 0 : agentList.acw);
	var _totalHolds = parseInt(agentList.holds == undefined ? 0 : agentList.holds);

	var _avgHandle = (_totalAnswered == 0 ? 0 : (parseInt(_activeTime) / _totalAnswered)) + (_totalAcw == 0 ? 0 : (parseInt(_acwTime) / _totalAnswered)) +
		(_totalHolds == 0 ? 0 : (parseInt(_holdTime) / _totalAnswered));
	return convert_time(_avgHandle);
}

function calculateAgentLogonDuration(duration, timestamp, agentState) {


	if (Number.isNaN(timestamp) || timestamp == undefined) {
		return "00:00:00";
	}
	if (agentState == 'LOGGED_OUT') {
		return convert_time(duration);

	}

	var startDate = new Date(parseInt(timestamp));

	var endDate = new Date();
	var num = (endDate.getTime() - startDate.getTime()) / 1000;
	num = duration == undefined ? num : duration + num;
	return convert_time(num);

}


function calculateAgentNotReadyDuration(duration, timestamp, agentState, _agentMeasureAuxCode, _auxCodeMeasureCode) {

	if (Number.isNaN(timestamp) || timestamp == undefined) {
		return "00:00:00";
	}
	if (agentState != 'NOT_READY' || _agentMeasureAuxCode != _auxCodeMeasureCode) {
		return convert_time(duration);

	}

	var startDate = new Date(parseInt(timestamp));

	var endDate = new Date();
	var num = (endDate.getTime() - startDate.getTime()) / 1000;
	num = (duration == undefined ? num : parseInt(duration) + num);
	return convert_time(num);

}


function calculateAgentNotReadyPercentage(_agentMeasures) {

	var _notReadyDuration = 0;
	var _loginDuration = 0;
	var _notReadyPercentage = 0;
	if (_agentMeasures.agentState == 'NOT_READY' || _agentMeasures.agentState == 'PENDING_NOT_READY') {
		var _notReadyStartDate = new Date(parseInt(_agentMeasures.agentNrReasonTimeStamp));
		var _loginStartDate = new Date(parseInt(_agentMeasures.loginTimeStamp));

		var endDate = new Date();
		var num = (endDate.getTime() - _notReadyStartDate.getTime()) / 1000;
		_notReadyDuration = (_agentMeasures.agentNotReadyTimeDuration == undefined ? num : _agentMeasures.agentNotReadyTimeDuration + num);

		var num1 = (endDate.getTime() - _loginStartDate.getTime()) / 1000;
		_loginDuration = (_agentMeasures.agentLogonDuration == undefined ? num1 : _agentMeasures.agentLogonDuration + num1);

		_notReadyPercentage = (_notReadyDuration / _loginDuration) * 100;


	}
	else if (_agentMeasures.agentState == 'LOGGED_OUT') {
		_notReadyDuration = (_agentMeasures.agentNotReadyTimeDuration == undefined ? 0 : _agentMeasures.agentNotReadyTimeDuration);


		_loginDuration = (_agentMeasures.agentLogonDuration == undefined ? 0 : _agentMeasures.agentLogonDuration);

		_notReadyPercentage = (_notReadyDuration == 0 ? 0 : ((_notReadyDuration / _loginDuration) * 100));

	} else {
		var _loginStartDate = new Date(parseInt(_agentMeasures.loginTimeStamp));

		var endDate = new Date();

		_notReadyDuration = (_agentMeasures.agentNotReadyTimeDuration == undefined ? 0 : _agentMeasures.agentNotReadyTimeDuration);

		var num1 = (endDate.getTime() - _loginStartDate.getTime()) / 1000;
		_loginDuration = (_agentMeasures.agentLogonDuration == undefined ? num1 : _agentMeasures.agentLogonDuration + num1);

		_notReadyPercentage = (_notReadyDuration == 0 ? 0 : ((_notReadyDuration / _loginDuration) * 100));

	}
	if (Number.isNaN(_notReadyPercentage))
		return "0.00";
	return _notReadyPercentage.toFixed(2);

}



function calculateOccupancy_avaya(accountDetail, agentState, loginTimeStamp, agentDetail) {

	var _agentLoginDuration = 0;
	var _active = 0;
	if (agentState == 'LOGGED_OUT') {
		_agentLoginDuration = ((accountDetail.accountLogonDuration == undefined || accountDetail.accountLogonDuration == 0) ? 0 : accountDetail.accountLogonDuration);
		_active = ((accountDetail.activeTimeDuration == undefined || accountDetail.activeTimeDuration == 0) ? 0 : accountDetail.activeTimeDuration);
	} else {
		var _timeStamp = 0;
		if (accountDetail.accountLoginTimeStamp == "UNKNOWN") {
			_timeStamp = loginTimeStamp;
		}
		else {
			_timeStamp = accountDetail.accountLoginTimeStamp;
		}
		var startDate = new Date(parseInt(_timeStamp));

		var endDate = new Date();
		var num = (endDate.getTime() - startDate.getTime()) / 1000;
		_agentLoginDuration = (accountDetail.accountLogonDuration == undefined ? num : accountDetail.accountLogonDuration + num);

		//if ((agentActiveInteractions != '0' || agentActiveInteractions > 0) && (agentWorkState == 'BUSY' || agentWorkState == 'AVAILABLE') || agentState == 'PENDING_NOT_READY') {
		if ((accountDetail.active != '0' || accountDetail.active > 0) && (agentDetail.workState == 'BUSY' || agentDetail.workState == 'AVAILABLE') || agentState == 'PENDING_NOT_READY') {
			var startDate1 = new Date(parseInt(agentDetail.agentWorkStateTimeStamp));

			var endDate1 = new Date();
			var num1 = (endDate1.getTime() - startDate1.getTime()) / 1000;

			//var _duration = (agentActiveDuration - agentBlendedActiveDuration);
			var _duration = (accountDetail.activeTimeDuration);
			_active = (_duration == undefined ? num1 : (_duration + num1));

		}
		else {
			//_active = (agentActiveDuration - agentBlendedActiveDuration);
			_active = accountDetail.activeTimeDuration;
		};
	}

	var _hold = ((accountDetail.holdDuration == undefined || accountDetail.holdDuration == 0) ? 0 : accountDetail.holdDuration);
	//var _active = ((accountDetail.activeTimeDuration == undefined || accountDetail.activeTimeDuration == 0) ? 0 : accountDetail.activeTimeDuration);
	var _acw = ((accountDetail.acwDuration == undefined || accountDetail.acwDuration == 0) ? 0 : accountDetail.acwDuration);

	var _occupancy = (((parseInt(_active) + parseInt(_hold)) + parseInt(_acw)) / parseInt(_agentLoginDuration)) * 100;
	if (Number.isNaN(_occupancy))
		return "0.00";
	return _occupancy.toFixed(2);

}


function calculateOccupancy_old(accountDetail, agentState, loginTimeStamp, agentDetail) {

	var _agentTime = 0;
	var _idleTime = 0;
	var _acwTime = accountDetail.acwDuration == undefined ? 0 : accountDetail.acwDuration;
	if (agentDetail.agentState == 'LOGGED_OUT' || agentDetail.agentState == 'NOT_READY') {

		_agentTime = (((accountDetail.activeTimeDuration == undefined) ? 0 : accountDetail.activeTimeDuration) - - ((accountDetail.blendedActiveDuration == undefined) ? 0 : accountDetail.blendedActiveDuration));
		_idleTime = agentDetail.idleTimeDuration == undefined ? 0 : agentDetail.idleTimeDuration;

	} else {

		if ((accountDetail.active != '0' || accountDetail.active > 0) && (agentDetail.workState == 'BUSY' || agentDetail.workState == 'AVAILABLE') || agentDetail.agentState == 'PENDING_NOT_READY') {
			var startDate1 = new Date(parseInt(agentDetail.agentWorkStateTimeStamp));

			var endDate1 = new Date();
			var num1 = (endDate1.getTime() - startDate1.getTime()) / 1000;

			var _duration = (((accountDetail.activeTimeDuration == undefined) ? 0 : accountDetail.activeTimeDuration) - ((accountDetail.blendedActiveDuration == undefined) ? 0 : accountDetail.blendedActiveDuration));
			_agentTime = (_duration == undefined ? num1 : (_duration + num1));
			_idleTime = agentDetail.idleTimeDuration == undefined ? 0 : agentDetail.idleTimeDuration;

		}
		else if (agentDetail.agentState == "IDLE" || agentDetail.agentState == "AVAILABLE") {
			var startDate2 = new Date(parseInt(agentDetail.agentWorkStateTimeStamp));

			var endDate2 = new Date();
			var num2 = (endDate2.getTime() - startDate2.getTime()) / 1000;

			var _duration = (agentDetail.idleTimeDuration);

			_idleTime = (agentDetail.idleTimeDuration == undefined ? num2 : (_duration + num2));
			_agentTime = ((accountDetail.activeTimeDuration == undefined) ? 0 : accountDetail.activeTimeDuration);

		}

	}
	_agentTime = _agentTime + _acwTime;


	var _occupancy = (parseInt(_agentTime) / (parseInt(_agentTime) + parseInt(_idleTime))) * 100;

	if (Number.isNaN(_occupancy))
		return "0.00";
	return _occupancy.toFixed(2);
}


function calculateOccupancy(accountDetail, agentState, loginTimeStamp, agentDetail) {

	var _agentTime = 0;
	var _idleTime = 0;
	if (agentDetail.agentState == 'LOGGED_OUT' || agentDetail.agentState == 'NOT_READY') {

		_agentTime = (agentDetail.agentLogonDuration == undefined ? 0 : agentDetail.agentLogonDuration) - (agentDetail.idleTimeDuration == undefined ? 0 : agentDetail.idleTimeDuration) - (agentDetail.agentNotReadyTimeDuration == undefined ? 0 : agentDetail.agentNotReadyTimeDuration);
		_idleTime = agentDetail.idleTimeDuration == undefined ? 0 : agentDetail.idleTimeDuration;

	} else {
		if ((accountDetail.active != '0' || accountDetail.active > 0) && (agentDetail.workState == 'BUSY' || agentDetail.workState == 'AVAILABLE') || agentDetail.agentState == 'PENDING_NOT_READY') {
			var startDate1 = new Date(parseInt(loginTimeStamp));

			var endDate1 = new Date();
			var num1 = (endDate1.getTime() - startDate1.getTime()) / 1000;

			var _duration = (agentDetail.agentLogonDuration == undefined ? 0 : agentDetail.agentLogonDuration) - (agentDetail.idleTimeDuration == undefined ? 0 : agentDetail.idleTimeDuration) - (agentDetail.agentNotReadyTimeDuration == undefined ? 0 : agentDetail.agentNotReadyTimeDuration);
			_agentTime = (_duration == undefined ? num1 : (_duration + num1));
			_idleTime = agentDetail.idleTimeDuration == undefined ? 0 : agentDetail.idleTimeDuration;

		} else if ((agentDetail.active == '0' || agentDetail.active == 0) && agentDetail.workState == 'AVAILABLE') {
			_idleTime = agentDetail.idleTimeDuration == undefined ? 0 : agentDetail.idleTimeDuration;
			_agentTime = (agentDetail.agentLogonDuration == undefined ? 0 : agentDetail.agentLogonDuration) - (agentDetail.idleTimeDuration == undefined ? 0 : agentDetail.idleTimeDuration) - (agentDetail.agentNotReadyTimeDuration == undefined ? 0 : agentDetail.agentNotReadyTimeDuration);
		}
		else if (agentDetail.workState == "IDLE") {
			var startDate2 = new Date(parseInt(agentDetail.agentWorkStateTimeStamp));

			var endDate2 = new Date();
			var num2 = (endDate2.getTime() - startDate2.getTime()) / 1000;

			var _duration = (agentDetail.idleTimeDuration);

			_idleTime = (agentDetail.idleTimeDuration == undefined ? num2 : (_duration + num2));
			_agentTime = (agentDetail.agentLogonDuration == undefined ? 0 : agentDetail.agentLogonDuration) - (agentDetail.idleTimeDuration == undefined ? 0 : agentDetail.idleTimeDuration) - (agentDetail.agentNotReadyTimeDuration == undefined ? 0 : agentDetail.agentNotReadyTimeDuration);
		}
	}

	var _occupancy = (parseInt(_agentTime) / (parseInt(_agentTime) + parseInt(_idleTime))) * 100;

	if (Number.isNaN(_occupancy))
		return "0.00";
	return _occupancy.toFixed(2);
}


function calculateConcurrency(accountDetail, agentDetail) {
	var _concurrency = 0;
	if (parseInt(accountDetail.activeTimeDuration) != 0 && agentDetail.agentState != "LOGGED_OUT") {

		var _logonDuration = 0;
		var _notReadyDuration = 0;
		var _activeDuration = 0;
		var _logonTimeStamp = 0;
		var _notReadyTimeStamp = 0;
		var _activeTimeStamp = 0;

		var _acwDuration = (accountDetail.acwDuration == undefined ? 0 : accountDetail.acwDuration);
		_logonTimeStamp = ((accountDetail.accountLoginTimeStamp == undefined || accountDetail.accountLoginTimeStamp == "UNKNOWN") ? agentDetail.loginTimeStamp : accountDetail.accountLoginTimeStamp);
		var _login = new Date(parseInt(_logonTimeStamp));
		var endDate = new Date();
		var num1 = (endDate.getTime() - _login.getTime()) / 1000;
		_logonDuration = accountDetail.accountLogonDuration == undefined ? num1 : accountDetail.accountLogonDuration + num1;

		if (agentDetail.agentState == "NOT_READY") {

			_notReadyTimeStamp = ((accountDetail.accountNrReasonTimeStamp == undefined || accountDetail.accountNrReasonTimeStamp == "UNKNOWN") ? agentDetail.agentNrReasonTimeStamp : accountDetail.accountNrReasonTimeStamp);
			var _notReady = new Date(parseInt(_notReadyTimeStamp))
			var num2 = (endDate.getTime() - _notReady.getTime()) / 1000;
			_notReadyDuration = accountDetail.accountNotReadyTimeDuration == undefined ? num2 : accountDetail.accountNotReadyTimeDuration + num2;
			_activeDuration = accountDetail.activeTimeDuration == undefined ? 0 : accountDetail.activeTimeDuration;

		} else {
			if ((accountDetail.active != '0' || accountDetail.active > 0) && (agentDetail.workState == 'BUSY' || agentDetail.workState == 'AVAILABLE')) {
				_activeTimeStamp = ((accountDetail.accountWorkStateTimeStamp == undefined || accountDetail.accountWorkStateTimeStamp == "UNKNOWN") ? agentDetail.agentWorkStateTimeStamp : accountDetail.accountWorkStateTimeStamp);
				var _active = new Date(parseInt(_activeTimeStamp))
				var num3 = (endDate.getTime() - _active.getTime()) / 1000;

				_activeDuration = accountDetail.activeTimeDuration == undefined ? num3 : accountDetail.activeTimeDuration + num3;
			}
			else {
				_activeDuration = accountDetail.activeTimeDuration == undefined ? 0 : accountDetail.activeTimeDuration;
			}
			_notReadyDuration = accountDetail.accountNotReadyTimeDuration == undefined ? agentDetail.agentNotReadyTimeDuration : accountDetail.accountNotReadyTimeDuration;
		}
		_activeDuration = _activeDuration + _acwDuration;

		_concurrency = (_activeDuration / ((_logonDuration) - (_notReadyDuration)));
	} else if (agentDetail.agentState == "LOGGED_OUT") {
		_concurrency = ((parseInt(accountDetail.activeTimeDuration) + parseInt(accountDetail.acwDuration)) /
			((accountDetail.accountLogonDuration == undefined ? 0 : parseInt(accountDetail.accountLogonDuration)) - (accountDetail.accountNotReadyTimeDuration == undefined ? 0 : parseInt(accountDetail.accountNotReadyTimeDuration))));
	}

	if (Number.isNaN(_concurrency))
		return "0.00";
	return _concurrency.toFixed(2);
}

function getServiceDetailsList() {
	$("#main").html("");

	$.ajax({
		url: KafkaMiddlewareURL + "getServiceDetailsList",
		type: 'POST',
		data: '0',
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
			//var _data = agentList[i].serviceName.;
			$.each(_data, function (key, value) {
				$("#ddlServiceList").append($("<option></option>").val(value.serviceName).text(value.serviceName));

			});
			//Multiselect
			$(document).ready(function () {
				$('#ddlServiceList').multiselect({
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

function getParameterByName(name) {
	name = name.replace(/[\[\]]/g, '\\$&');

	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(encodeURLValue());
	if (!results) return null;
	if (!results[2]) return '';
	return results[2];
}

function cleanHTML(param) {
	if (String(param).match(/^(?:[a-zA-Z0-9\s@,=%$.::|)(/#&-_\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF]|[\u0660-\u0669])){0,300}$/)) {
	 	return param;
	}
	 return '';
}

function encodeURLValue(url){
	var value = encodeURI(window.location.href); 
	return value;
}

function WriteLog(type, msg) {
	if (IS_CONSOLE_LOG_ENABLE == false)
		return;
	var log = WIDGET_NAME + " --> " + type + " --> " + get_time() + " --> ";
	var log = WIDGET_NAME + " --> " + type + " --> " + get_time() + " --> ";
	if (type == INFO) {
		console.log(`%c ${log}`, "color:Green;font-weight: bold", msg, "");
	}
	else if (type == DEBUG) {
		console.log(`%c ${log}`, "color:DodgerBlue;font-weight: bold", msg, "");
	}
	else if (type == ERROR) {
		console.log(`%c ${log}`, "color:Red;font-weight: bold", msg, "");
	}
	else if (type == WARNING) {
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
	return startDate.getDate() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getFullYear()
		+ ' ' + hours + ':' + minutes + ':' + seconds;
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


	if (number == undefined || number == '-' || number == 0) {
		return 0;
	}
	var _hms = number.split(':');

	if (_hms.length == 0 || _hms.length == 1) {
		if (typeof number === 'string' || number instanceof String)
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
	WriteLog(INFO, event.data);
	if (event.data.message.toString() == "DashboardInfo") {
		WriteLog(INFO, "Dashboard Refresh Event Received Successfully");
		
		refreshSupervisorDashboard = event.data.refresh;
		dashboard = event.data.dashboardId;
		WriteLog(INFO, "Dashboard - " + dashboard + " & RefreshEnabled - " + refreshSupervisorDashboard);
	} 
});

function refreshSupervisorDashboardEvent() {

	if (refreshSupervisorDashboard && dashboard == 'DASHBOARD_004') {
		get_response_supervisor();
	}
	objTimeount = setTimeout(function () {
		refreshSupervisorDashboardEvent();

	}, autoRefreshTime * 1000);
}
/** * Event Listener to Dashboard Refresh - End */
