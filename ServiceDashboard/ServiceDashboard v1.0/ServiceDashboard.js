var objTimeount; 
var _obj;
var _queueList_new ={};
var agentAccountListraw={};
var agentAccountListnew={};

var refreshDashboard = false;
var refreshDashboardName ="";
var dashboard ="";
var dashboardID ="";
var serviceGroupName = "ALL";
var _teamGroupList=[];
var acmResponse = false;

$(document).ready(function(){
	//Custom Script For Table Sorting On Page Load - Start
	var tableID = "#tblServiceQueue";
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
				$(tableID + ' tbody').append(row);
			});
		});
	});
	//Custom Script For Table Sorting On Page Load - End

});

$(document).on('keyup', '#tblAgentList_filter .input-text1', function (e) {  
	if(e.keyCode ==88){
		return
	}
	objTimeount=null; 
	if($("#tblAgentList_filter .input-text1").val().length == 0){
		get_response('SUPERVISOR');
	} 
  });
  $(document).on('keypress', '#tblAgentList_filter .input-text1', function (e) {  
	objTimeount=null; 
	});
	function clearTimer(){
		if(objTimeount!= undefined){
			window.clearTimeout(objTimeount)
			objTimeount=null; 
		} 
	}

function loadServiceDashboard(){
	get_response('SERVICE');
}
function get_response(dashboard) {
	var queryParam = null;
	var serviceName = null;
	var refreshDashboard = false;
	refreshDashboard = getParameterByName('enableRefresh') == 'start' ? true : false;
	 if (dashboard == 'SERVICE') {
		queryParam = serviceGroupName;		
		serviceName = 'getServiceDetailsList';
		_type = 'POST';
	}
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
                 var obj_data = JSON.parse(response.responseText);
				 load_data(obj_data, dashboard);
			}
		}
	});
}
function load_data(obj_data, dashboard) {
	 if (dashboard == 'SERVICE') {
		var queueList = {};
		queueList = getQueueFormulasList(obj_data);
		queueList = alasql("SELECT * FROM ? ORDER BY serviceDisplayName", [queueList]);
		var _searchFilterValue = $("#txtSearchInput").val()
		var _whereFilerQuery = "";
		var _totalFilterQuery = "SELECT SUM(answered) as answered, SUM(abandoned) as abandoned,"
						+ "SUM(answeredAfterThreshold) as answeredAfterThreshold, SUM(abandonedAfterThreshold) as abandonedAfterThreshold,"
						+ "SUM(transferredAccepted) as transferredAccepted, SUM(acw) as acw,"
						+ "SUM(holds) as holds, SUM(activeTimeDuration) as activeTimeDuration,"
						+ "SUM(acwDuration) as acwDuration, SUM(holdDuration) as holdDuration,"
						+ "SUM(consultInitiatedToService) as consultInitiatedToService, SUM(consultAcceptedFromService) as consultAcceptedFromService,"
						+ "SUM(contactsWaiting) as contactsWaiting, SUM(expectedWaitTime) as expectedWaitTime";
		if(_searchFilterValue != undefined && _searchFilterValue != "") {
			_whereFilerQuery = "WHERE serviceDisplayName LIKE '%" + _searchFilterValue + "%'";
		}
		var _totalQuery = _totalFilterQuery + " FROM ? " + _whereFilerQuery;
		var totalList = alasql(_totalQuery, [queueList]);
		_queueList_new = queueList;
		$("#tblServiceQueue > tbody").html("");
		var html = "";
		for (var i = 0; i < queueList.length; i++) {
			html += "<tr class=\"parent service_" + i + "\" id=\'parent_" + i + "\'>";
			html += "<td class=\"table-tooltip\" style=\"white-space: nowrap\" data-label=\"Service Name\" >" + cleanHTML(queueList[i].serviceDisplayName) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"Contacts waiting\">" + cleanHTML(queueList[i].contactsWaiting) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"offered\">" + cleanHTML(queueList[i].offered) + "</td>";
            html += "<td class=\"perentCell align-center\" data-label=\"answered\">" + cleanHTML(queueList[i].answered) + "</td>";
            html += "<td class=\"perentCell align-center\" data-label=\"abandoned\">" + cleanHTML(queueList[i].abandoned) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"Transfer Accpeted\">" + cleanHTML(queueList[i].transferredInitiated) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"Transfer Accpeted\">" + cleanHTML(queueList[i].transferredAccepted) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"Consult Initiated\">" + cleanHTML(queueList[i].consultInitiatedToService) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"Consult Accpeted\">" + cleanHTML(queueList[i].consultAcceptedFromService) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"Service Level\">" + cleanHTML(queueList[i].serviceLevel) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"Active Agents\">" + cleanHTML(queueList[i].contactsAtAgent) + "</td>";
            html += "<td class=\"perentCell align-center\" data-label=\"onhold\" >" + cleanHTML(queueList[i].heldContacts) + "</td>";
           	html += "<td class=\"agents align-center\" data-label=\"Total Agents\">" + cleanHTML(queueList[i].available) + "</td>";
		   	html += "<td class=\"queue align-center\" data-label=\"Not Ready\">" + cleanHTML(queueList[i].notReady) + "</td>";
            html += "<td class=\"average align-center\" data-label=\"Average Handling Time\">" + cleanHTML(queueList[i].averageHandlingTime) + "</td>";
			html += "<td class=\"average align-center\" data-label=\"Expected Wait Time\">" + cleanHTML(calculateExpectedWaitTime(queueList[i])) + "</td>";
			html += "</tr>";
		}
		$('#tblServiceQueue > tbody').append(html);
        //Custom Script For Table Sorting on Refresh - Start
		var tableID = "#tblServiceQueue";
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
				$(tableID + ' tbody').append(row);
			});
		};
		var _searchValue = $("#txtSearchInput").val();
		if(_searchValue != null && _searchValue != undefined && _searchValue != "") {
			$("#tblServiceQueue tbody > tr").filter(function() {
				$(this).addClass('filtered-row').toggle($(this).text().toLowerCase().indexOf(_searchValue.toLowerCase()) > -1)
			});
			get_tblServiceQueue_pos();
		}
			$('#tblServiceQueue > tfoot').html("");
			var result=[];
			$('#tblServiceQueue tbody > tr').each(function(){
				var _style = $(this).css('display')
				if(_style != "none") {
					$('td', this).each(function(index, val){
						if(!result[index]) 
							result[index] = 0;
						var _tdText = $(val).text() == '-' ? "0" : $(val).text();
						result[index] += cleanHTML(hhmmssTOseconds(_tdText));
					});
				}
			});
			result[0] = "Total";
			result[result.length - 1] = calculateExpectedWaitTime(totalList[0]);
			result[result.length - 2] = calculateAverageHandleTime(totalList[0]);
			result[result.length - 3] = "-";
			result[result.length - 4] = "-";
			result[result.length - 7] = calculateServiceLevelPercentage(totalList[0]);
			if(result[0] == "NaN:NaN:NaN")
				result[0] ="No Data Found";
			$('#tblServiceQueue > tfoot').append('<tr></tr>');
			$(result).each(function(){
				$('#tblServiceQueue tfoot tr').append('<td class=\"align-center\">'+this+'</td>');
				
			});
			get_tblServiceQueue_pos();
		
    }
    
}
function get_tblServiceQueue_pos() {
	var serviceQueue_col_head = ".table-container#tblServiceQueue > thead > tr:first-child > th";
	serviceQueue_col_body = ".table-container#tblServiceQueue > tbody > tr > td";
	serviceQueue_col_foot = ".table-container#tblServiceQueue > tfoot > tr > td";
	serviceQueue_colone_Width_val = $(serviceQueue_col_head +":nth-of-type(1)").innerWidth();
	serviceQueue_colone_Width = serviceQueue_colone_Width_val - 1;
	console.log("col_one Width : " + serviceQueue_colone_Width);
	serviceQueue_coltwo_Width_val = $(serviceQueue_col_head +":nth-of-type(2)").innerWidth();
	serviceQueue_coltwo_Width = serviceQueue_coltwo_Width_val + .5;
	console.log("col_two Width : " + serviceQueue_coltwo_Width);
	$(serviceQueue_col_head +":nth-of-type(1)").css("left", "-1px");
	$(serviceQueue_col_body +":nth-of-type(1)").css("left", "-1px");
	$(serviceQueue_col_foot +":nth-of-type(1)").css("left", "-1px");
	$(serviceQueue_col_head +":nth-of-type(2)").css("left", serviceQueue_colone_Width + "px");
	$(serviceQueue_col_body +":nth-of-type(2)").css("left", serviceQueue_colone_Width + "px");
	$(serviceQueue_col_foot +":nth-of-type(2)").css("left", serviceQueue_colone_Width + "px");
}
function getQueueFormulasList(agentList) {
	var _list = [];
	var _serviceName = '';
	
	for (var i = 0; i < agentList.length; i++) {
		var _jsonValues = JSON.parse(agentList[i].serviceData);
		if (_jsonValues == null || _jsonValues == undefined) {
			return _list;
		}
		for (var k in serviceGroupList) {
			_serviceName = '';
			if (serviceGroupList[k].serviceName == agentList[i].serviceName) {
				_serviceName = serviceGroupList[k].typeDescription;
				break;
			}
		}
		
	
		if ((_jsonValues.offered > 0 || _jsonValues.answered > 0) || _jsonValues.contactsWaiting > 0 
								|| _jsonValues.transferredAccepted > 0 || _jsonValues.abandoned > 0) {
			var formulas = {
				serviceDisplayName: _serviceName == '' ? agentList[i].serviceName : _serviceName,
				serviceName: agentList[i].serviceName,
				contactsWaiting: _jsonValues.contactsWaiting == undefined ? 0 : _jsonValues.contactsWaiting,
				//offered: _jsonValues.offered == undefined ? 0 : _jsonValues.offered,
				//offered: (_jsonValues.answered == undefined ? 0 : _jsonValues.answered) + (_jsonValues.abandoned == undefined ? 0 : _jsonValues.abandoned),
				offered: (_jsonValues.answered == undefined ? 0 : _jsonValues.answered) + (_jsonValues.abandoned == undefined ? 0 : _jsonValues.abandoned) +(_jsonValues.contactsWaiting == undefined ? 0 : _jsonValues.contactsWaiting),
				answered: _jsonValues.answered == undefined ? 0 : _jsonValues.answered,
				abandoned: _jsonValues.abandoned == undefined ? 0 : _jsonValues.abandoned,
				answeredAfterThreshold: _jsonValues.answeredAfterThreshold == undefined ? 0 : _jsonValues.answeredAfterThreshold,
				abandonedAfterThreshold: _jsonValues.abandonedAfterThreshold == undefined ? 0 : _jsonValues.abandonedAfterThreshold,
				transferredInitiated: _jsonValues.transferredInitiated == undefined ? 0 : _jsonValues.transferredInitiated,
				transferredAccepted: _jsonValues.transferredAccepted == undefined ? 0 : _jsonValues.transferredAccepted,
				consultInitiatedToService: (_jsonValues.consultsInitiatedToService == undefined ? 0 :parseInt(_jsonValues.consultsInitiatedToService)),
				consultAcceptedFromService: (_jsonValues.consultsAcceptedFromService == undefined ? 0 :parseInt(_jsonValues.consultsAcceptedFromService)),				
				acw: _jsonValues.acw == undefined ? 0 : _jsonValues.acw,
				holds: _jsonValues.holds == undefined ? 0 : _jsonValues.holds,
				activeTimeDuration: _jsonValues.activeTimeDuration == undefined ? 0 : _jsonValues.activeTimeDuration,
				acwDuration: _jsonValues.acwDuration == undefined ? 0 : _jsonValues.acwDuration,
				holdDuration: _jsonValues.holdDuration == undefined ? 0 : _jsonValues.holdDuration,
				//serviceLevel: _jsonValues.serviceLevelPercent == undefined ? 0 : _jsonValues.serviceLevelPercent,
				serviceLevel: calculateServiceLevelPercentage(_jsonValues),
				contactsAtAgent: _jsonValues.contactsAtAgent == undefined ? 0 : _jsonValues.contactsAtAgent,
				heldContacts: _jsonValues.heldContacts == undefined ? 0 : _jsonValues.heldContacts,
				staffed: _jsonValues.staffed == undefined ? 0 : _jsonValues.staffed,
				available: _jsonValues.available == undefined ? 0 : _jsonValues.available,
				notReady: _jsonValues.resourceInNotReady == undefined ? 0 : _jsonValues.resourceInNotReady,
				averageHandlingTime: calculateAverageHandleTime(_jsonValues),
				averageSpeedOfAnswer: convert_time(_jsonValues.averageSpeedOfAnswer == undefined ? 0 : _jsonValues.averageSpeedOfAnswer),
				// Sha Mar14
				expectedWaitTime: _jsonValues.expectedWaitTime == undefined ? 0 : parseInt(_jsonValues.expectedWaitTime),
				//expectedWaitTime: calculateExpectedWaitTime(_jsonValues),
				
			}
			_list.push(formulas);
		}
	}
	return _list;
}
function getJsonValues(obj, key) {
	var objects = [];
	for (var i in obj) {
		if (!obj.hasOwnProperty(i)) continue;
		if (typeof obj[i] == 'object') {
			if (i == key) {
				return obj[i];
			}
			objects = objects.concat(getJsonValues(obj[i], key));
		} else if (i == key) {
			objects.push(obj[i]);
		}
	}
	return objects;
}
function getDropDownData() {
	$("#main").html("");
	var _request={
		"serviceName" : "getRoutingServiceList",
		"requestData" : ""
	}
	$.ajax({
		url: WidgetMiddlewareURL + "customWidgetPostRequest",	
		type: 'POST',	
		data: JSON.stringify(_request),	
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
			serviceGroupList = _data;
			$.each(_data, function (key, value) {
                $("#ddlServiceList").append($("<option></option>").val(value.serviceName).text(value.typeDescription));
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
			get_response("QUEUE");
		},
		failure: function () {
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
	if (String(param).match(/^(?:[a-zA-Z0-9\s@,=%$.:|#&/)(\-_\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF]|[\u0660-\u0669])){0,300}$/)) {
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
	if (type == INFO) {
		console.log("%c" + log, "color:Green;font-weight: bold", msg, "");
	}
	else if (type == DEBUG) {
		console.log("%c" + log, "color:DodgerBlue;font-weight: bold", msg, "");
	}
	else if (type == ERROR) {
		console.log("%c" + log, "color:Red;font-weight: bold", msg, "");
	}
	else if (type == WARNING) {
		console.log("%c" + log, "color:Orange;font-weight: bold", msg, "");
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
	if (hours < 0) { hours = "-0" + Math.abs(hours); }
	else if (hours < 10) { hours = "0" + hours; }
	if (minutes < 10) { minutes = "0" + minutes; }
	if (seconds < 10) { seconds = "0" + seconds; }
	var _time =  hours + ':' + minutes + ':' + seconds;
	if(_time == "NaN:NaN:NaN")
		return '00:00:00';
	return _time;
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

function calculateAverageHandleTime(agentList) {
	var _activeTime = (agentList.activeTimeDuration == undefined ? 0 : agentList.activeTimeDuration);
	var _acwTime = (agentList.acwDuration == undefined ? 0 : agentList.acwDuration);
	var _holdTime = (agentList.holdDuration == undefined ? 0 : agentList.holdDuration);
	var _totalAnswered = parseInt(agentList.answered == undefined ? 0 : agentList.answered) + parseInt(agentList.transferredAccepted == undefined ? 0 : agentList.transferredAccepted)
	var _totalAcw = parseInt(agentList.acw == undefined ? 0 : agentList.acw);
	var _totalHolds = parseInt(agentList.holds == undefined ? 0 : agentList.holds);
	var _avgHandle = (_totalAnswered == 0 ? 0 : (parseInt(_activeTime) / _totalAnswered)) + (_totalAcw == 0 ? 0 :(parseInt(_acwTime) / _totalAnswered)) + 
		(_totalHolds == 0 ? 0 : (parseInt(_holdTime) / _totalAnswered));	
	return convert_time(_avgHandle);
}
function calculateExpectedWaitTime(queueList) {
	var _ewtTime = (queueList.expectedWaitTime == undefined ? 0 : queueList.expectedWaitTime);
	var _contactsWaiting = parseInt(queueList.contactsWaiting == undefined ? 0 : queueList.contactsWaiting);
	var _expectedWait = (_contactsWaiting == 0 ? 0 : (parseInt(_ewtTime) / _contactsWaiting)) ;
	return convert_time(_expectedWait);
}
function calculateServiceLevelPercentage(queueList) {
	var _answered = (queueList.answered == undefined ? 0 : queueList.answered);
	var _answeredAfterThreshold = (queueList.answeredAfterThreshold == undefined ? 0 : queueList.answeredAfterThreshold);	
	var _serviceLevel = ((parseInt(_answered) - parseInt(_answeredAfterThreshold)) / parseInt(_answered)) * 100;
	if(_answered == 0) {
		return "-";
	}
	if(Number.isNaN(_serviceLevel))
		return "0.00";
	return _serviceLevel.toFixed(2);
}
function Initilize_timer_fields() {
	update_agentIdleTime();
}

function update_agentIdleTime() {
	
/** * Event Listener to Dashboard Refresh - Start */
window.addEventListener('message', function (event) {
	WriteLog(INFO, "Listener for Toekn --> START");
	WriteLog(INFO, event.data);
	if (event.data.message.toString() == "DashboardInfo") {
		WriteLog(INFO, "Dashboard Refresh Event Received Successfully");
		clearTimer();
		refreshDashboard = event.data.refresh;
		dashboardID = event.data.dashboardId;
		if (refreshDashboard) {
			refreshDashboardEvent()
		}
	}
});

function refreshDashboardEvent() {
	 if (refreshDashboard && dashboardID == 'DASHBOARD_002') {
		loadServiceDashboard();
	}
	objTimeount = setTimeout(function () {
		refreshDashboardEvent();
	}, autoRefreshTime * 1000);

}
}