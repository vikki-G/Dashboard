var objTimeount; 
var _obj;
var _queueList_new ={};
var agentAccountListraw={};
var agentAccountListnew={};

var refreshDashboard = false;
var refreshDashboardName ="";
var dashboard ="";
var dashboardID ="";
var serviceGroupName = '0';
var _teamGroupList=[];
var acmResponse = false;

$(document).ready(function(){
var tableID3 = "#tblAgentList";
$(tableID3 + ' th.sorting').each(function (col) {
	$(this,".sorting").hover(
		function () {
			$(this).addClass('focus');
		},
		function () {
			$(this).removeClass('focus');
		}
	);
	$(this,".sorting").click(function () {
		
		if ($(this).is('.asc')) {
			$(this).removeClass('asc');
			$(this).addClass('desc selected');
			sortOrder = -1;
		} else {
			$(this).addClass('asc selected');
			$(this).removeClass('desc');
			sortOrder = 1;
		}				
		$(this,".sorting").siblings().removeClass('asc selected');
		$(this,".sorting").siblings().removeClass('desc selected');
		var arrData = $(tableID3).find('tbody#tblAgentList_body > tr:has(td)').get();
		arrData.sort(function (a, b) {
			var val1 = $(a).children('td').eq(col).text().toUpperCase();
			var val2 = $(b).children('td').eq(col).text().toUpperCase();
			if ($.isNumeric(val1) && $.isNumeric(val2))
				return sortOrder == 1 ? val1 - val2 : val2 - val1;
			else
				return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
		});
		$.each(arrData, function (index, row) {
			$(tableID3 + ' > tbody#tblAgentList_body').append((row));
		});
	});
});
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


function loadAgentDashboard(){
	get_response('AGENT');
}

function get_response(dashboard) {
	var queryParam = null;
	var serviceName = null;
	var refreshDashboard = false;
	refreshDashboard = getParameterByName('enableRefresh') == 'start' ? true : false;
	if (dashboard == 'AGENT') {
		queryParam = 'akram.youseef'; 
		serviceName = 'getAgentDetails';
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
				if (dashboard == 'AGENT') {
					Initilize_timer_fields();
				}
			}
		}
	});
}

function load_data(obj_data, dashboard) {
	var json_data = [];
	var json_values = {};
	var getFormula = '';
	var properties = '';

	if (dashboard == 'AGENT') {
		properties = agent_properties;
		getFormula = getAgentDetails(obj_data);
		$('#lbl_agentId').text(obj_data.agentDisplayName);
		$("#main").html("");
		WriteLog(INFO, 'getFormula -> ' + getFormula);
		Object.keys(properties).forEach(function (k) {
			var formula_output = getJsonValues(getFormula, k) == null ? "" :getJsonValues(getFormula, k)[0];
			var json_obj = {
				"id": k,
				"value": formula_output,
				"name": properties[k]
			};
			json_values[k] = formula_output;
			json_data.push(json_obj);
		});
		WriteLog(INFO, json_values);
		for (var i = 0; i < json_data.length; i++) {
			if (json_data[i].name != "") {
				var json_value_data = json_values[json_data[i].id] == undefined ? 0 : json_values[json_data[i].id];
                $("#main").append('<li class="col-lg-3 col-md-3 col-sm-3 col-xs-12"><div class="dashboard-content">'
                    + '<div class="dashboard-content-head"><h4  id=label' + cleanHTML(json_data[i].id) + '><i class="far fa-clock"></i> ' + cleanHTML(json_data[i].name) + '</h4></div>'
                    + '<div class="dashboard-content-value" id="countDiv_' + cleanHTML(json_data[i].id) + '"><h2 data-plugin="counterup" id=count_' + cleanHTML(json_data[i].id) + '>' + cleanHTML(json_value_data) + '</h2></div>'
					+ '</div></li>');
			}
		}
	}
}

function getAgentDetails(agentList) {
	agentState = agentList.agentState;
	agentWorkState = agentList.workState;
	agentLogonDuration = agentList.agentLogonDuration;
	agentLastLoginTime = agentList.loginTimeStamp;
	agentNotReadyDuration = agentList.agentNotReadyTimeDuration;
	agentActiveDuration = agentList.activeTimeDuration;
	agentBlendedActiveDuration = agentList.blendedActiveDuration;
	agentIdleDuration = agentList.idleTimeDuration;
	agentNotReadyTimeStamp = agentList.agentNrReasonTimeStamp;
	agentWorkStateTimeStamp = agentList.agentWorkStateTimeStamp;
	agentVoiceCallState = agentList.agentVoiceCallState;
	agentActiveInteractions = agentList.active;
	agentLastStateTimeStamp = agentList.lastStateChangeUserTimestamp;
	agentAcwDuration = agentList.acwDuration;
	var _avgHandlingtime = calculateAverageHandleTime(agentList);
	var _activeTime = agentList.activeTimeDuration + agentList.acwDuration;
	var formulas = {
		agentDisplayName: agentList.agentDisplayName,
		agentLogonDuration: agentList.agentState == 'LOGGED_OUT' ? convert_time(agentList.agentLogonDuration) : agentLogonDurationTick,
		agentNotReadyTimeDuration: agentList.agentState == 'NOT_READY' ? agentNotReadyDurationTick : convert_time(agentList.agentNotReadyTimeDuration),
		activeTimeDuration: ((agentList.active != '0' || agentList.active > 0) && (agentList.workState == 'BUSY' || agentList.workState == 'AVAILABLE')) ? agentActiveDurationTick : convert_time(_activeTime),
		idleTimeDuration: agentList.workState == 'IDLE' ? agentIdleDurationTick : convert_time(agentList.idleTimeDuration) ,
		agentWorkTime: "NA",
		answered: agentList.answered,
		agentNotReady: agentList.agentNotReady,
		notAnswered: agentList.notAnswered,
		transferredAccepted:agentList.transferredAccepted,
		transferredInitiated:agentList.transferredInitiated,
		offered: agentList.offered,
		abandoned: agentList.abandoned,
		occupancy: "NA",
		agentNotReadyPendingDuration: calculatePendingNotReady(agentList),
		concurrency: 'NA',
		personalOutboundContacts: agentList.personalOutboundContacts,
		averageWrapUpTime: convert_time((agentList.acw == 0 ? 0 : parseInt(agentList.acwDuration / agentList.acw))),
		averageSpeedOfAnswer: convert_time((agentList.answered == 0 ? 0 : parseInt(agentList.alertDuration / agentList.answered))),
		averageHandlingTime: _avgHandlingtime,
	}
	return formulas;
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
function calculatePendingNotReady(agentList) {
	var _pendingDuration = 0;
	if(parseInt(agentList.agentLogonDuration) > 0){
		_pendingDuration = (parseInt(agentList.agentLogonDuration) - parseInt(agentList.activeTimeDuration) - parseInt(agentList.holdDuration)
				- parseInt(agentList.acwDuration) - parseInt(agentList.idleTimeDuration)  - parseInt(agentList.agentNotReadyTimeDuration))
	}
	return convert_time(Math.abs(_pendingDuration));
}
function Initilize_timer_fields() {
	update_agentLogonTime();
	update_agentNotReadyTime();
	update_agentIdleTime();
}

function update_agentLogonTime() {
	if (agentState == '' || agentState == undefined) {
		return;
	}
	if (agentState == 'LOGGED_OUT') {
		agentLogonDurationTick = convert_time(agentLogonDuration);
		return;
	}
	if(agentLastLoginTime == "UNKNOWN")
		agentLastLoginTime = agentLastStateTimeStamp;
	var startDate = new Date(parseInt(agentLastLoginTime));
	var endDate = new Date();
	var num = (endDate.getTime() - startDate.getTime()) / 1000;
	num = agentLogonDuration == undefined ? num : agentLogonDuration + num;
	agentLogonDurationTick = convert_time(num + 1);
	$('#count_agentLogonDuration').html(cleanHTML(agentLogonDurationTick));
	setTimeout(function () { update_agentLogonTime(); }, 1000);
}
function update_agentNotReadyTime() {
	if (agentState == '' || agentState == undefined) {
		return;
	}
	if (agentState == 'NOT_READY' ) {
		var startDate = new Date(parseInt(agentLastStateTimeStamp));
		var endDate = new Date();
		var num = (endDate.getTime() - startDate.getTime()) / 1000;
		num = agentNotReadyDuration == undefined ? num : agentNotReadyDuration + num;
		agentNotReadyDurationTick = convert_time(num + 1);
		$('#count_agentNotReadyTimeDuration').html(cleanHTML(agentNotReadyDurationTick));
		setTimeout(function () { update_agentNotReadyTime(); }, 3000);
	}
	else {
		agentNotReadyDurationTick = convert_time(agentNotReadyDuration);
	}
}
function update_agentActiveTime() {
	if (agentActiveInteractions == undefined || agentActiveInteractions == ''  || agentWorkState == undefined) {
		return;
	}
	if ((agentActiveInteractions != '0' || agentActiveInteractions > 0) && (agentWorkState == 'BUSY' || agentWorkState == 'AVAILABLE' ) || agentState == 'PENDING_NOT_READY') {
		var startDate = new Date(parseInt(agentWorkStateTimeStamp));
		var endDate = new Date();
		var num = (endDate.getTime() - startDate.getTime()) / 1000;
		var _duration = (agentAcwDuration + agentActiveDuration);
		num = (agentActiveDuration == undefined ? num : (_duration + num));
		agentActiveDurationTick = convert_time(num + 1);
		$('#count_activeTimeDuration').html(cleanHTML(agentActiveDurationTick));
		setTimeout(function () { update_agentActiveTime(); }, 3000);
	}
	else {
		agentActiveDurationTick = convert_time(agentActiveDuration + agentAcwDuration);
	}
}

function update_agentIdleTime() {
	if (agentWorkState == '' || agentWorkState == undefined) {
		return;
	}
	if (agentWorkState == 'IDLE') {
		var startDate = new Date(parseInt(agentWorkStateTimeStamp));
		var endDate = new Date();
		var num = (endDate.getTime() - startDate.getTime()) / 1000;
		num = agentIdleDuration == undefined ? num : agentIdleDuration + num;
		agentIdleDurationTick = convert_time(num + 1);
		$('#count_idleTimeDuration').html(cleanHTML(agentIdleDurationTick));
		agentLastWorkStateTimeStamp = agentWorkStateTimeStamp;
		agentLastWorkState = agentWorkState;
		counter = 0;
		agentWorkDuration = (agentActiveDuration) - agentBlendedActiveDuration;
		agentWorkTimeTick = convert_time(agentWorkDuration);
		setTimeout(function () { update_agentIdleTime(); }, 1000);
	}
	else {
		agentIdleDurationTick = convert_time(agentIdleDuration);
	}
}	

	
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
	if (refreshDashboard && dashboardID == 'DASHBOARD_001') {
		loadAgentDashboard();
	}
	objTimeount = setTimeout(function () {
		refreshDashboardEvent();
	}, autoRefreshTime * 1000);

}
/** * Event Listener to Dashboard Refresh - End */

//}