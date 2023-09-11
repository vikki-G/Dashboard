
var totalAnsweredContact = 0;
var totalTransferedAccepted = 0;
var totalAcwCount = 0;
var totalHoldCount = 0;
var totalActiveTimeDuration = 0;
var totalAcwTimeDuration = 0;
var totalHoldTimeDuration = 0;
var refreshAgentDashboard = false;

function get_response_agent() {
	var queryParam = 'akram.youseef'; 
	var serviceName =  'getAgentDashboardDetails';
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
				load_data(obj_data);
			}
		}
	});
}

function load_data(obj_data) {
		var agentList = {};
		agentList = bindAgentDashboardDetailList(obj_data);
		agentList = agentList[0];
	
		var _currentState = agentList.agentState + (agentList.agentState == 'NOT_READY' ? ' (' +agentList.nrReasonName+')' : '' );
		$('#lbl_agentId').text(agentList.agentDisplayName);
		$('#lbl_AgentState').text(_currentState);
		$('#lbl_CurrentStateDuration').text(agentList.currentStateDuration);
		$('#lbl_TotalLoginDuration').text(agentList.totalLoginDuration);
		$("#tbl_performanceteam > tbody").html("");
		var html = "";
		for (var i = 0; i < agentList.accountDetails.length; i++) {
			html += "<tr class=\"parent service_" + i + "\" id=\'parent_" + i + "\'>";
			html += "<td class=\"table-tooltip\" data-label=\"Channel\" >" + cleanHTML(agentList.accountDetails[i].channel) + "</td>";
            html += "<td class=\"perentCell align-center\" data-label=\"Answered\">" + cleanHTML(agentList.accountDetails[i].answered) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"Complete\">" + cleanHTML(agentList.accountDetails[i].complete) + "</td>";
            html += "<td class=\"perentCell align-center\" data-label=\"Accepted\">" + cleanHTML(agentList.accountDetails[i].transferAccepted) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"Initiated\">" + cleanHTML(agentList.accountDetails[i].transferInitiated) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"ConsultInitiated\">" + cleanHTML(agentList.accountDetails[i].consultInitiatedToService) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"ConsultAccepted\">" + cleanHTML(agentList.accountDetails[i].consultAcceptedFromService) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"AverageTalkTime\">" + cleanHTML(agentList.accountDetails[i].averageTalkTime) + "</td>";
			html += "<td class=\"perentCell align-center\" data-label=\"AverageHoldTime\">" + cleanHTML(agentList.accountDetails[i].averageHoldTime) + "</td>";
            html += "<td class=\"perentCell align-center\" data-label=\"AverageWrapTime\">" + cleanHTML(agentList.accountDetails[i].averageWrapTime) + "</td>";
            html += "<td class=\"perentCell align-center\" data-label=\"AverageHandleTime\">" + cleanHTML(agentList.accountDetails[i].averageHandleTime) + "</td>";
            html += "<td class=\"perentCell align-center\" data-label=\"OutboundCalls\" >" + cleanHTML(agentList.accountDetails[i].outboundCalls) + "</td>";
            html += "<td class=\"perentCell align-center\" data-label=\"OutboundDuration\">" + cleanHTML(agentList.accountDetails[i].outboundDuration) + "</td>";
            html += "<td class=\"perentCell align-center\" data-label=\"HoldCount\">" + cleanHTML(agentList.accountDetails[i].holdCount) + "</td>";
            html += "<td class=\"perentCell align-center\" data-label=\"HoldDuration\">" + cleanHTML(agentList.accountDetails[i].holdDuration) + "</td>";
			html += "</tr>";
		}
		$('#tbl_performanceteam > tbody').append(html);
		$('#tbl_performanceteam > tfoot').html("");
		var result = [];
		var _rows = 0;
		$('#tbl_performanceteam tbody > tr').each(function () {
			var _style = $(this).css('display');
			_rows = _rows + 1;
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
		result[result.length - 1] = convert_time(result[result.length - 1]);
		result[result.length - 3] = convert_time(result[result.length - 3]);
		result[result.length - 5] = calculateTotalAgentHandleTime();
		result[result.length - 6] = convert_time((totalAnsweredContact + totalTransferedAccepted) == 0 ? 0 : (totalAcwTimeDuration / (totalAnsweredContact + totalTransferedAccepted)));
		result[result.length - 7] = convert_time((totalAnsweredContact + totalTransferedAccepted) == 0 ? 0 : (totalHoldTimeDuration / (totalAnsweredContact + totalTransferedAccepted)));
		result[result.length - 8] = convert_time((totalAnsweredContact + totalTransferedAccepted) == 0 ? 0 : (totalActiveTimeDuration / (totalAnsweredContact + totalTransferedAccepted)));

		$('#tbl_performanceteam > tfoot').append(('<tr></tr>'));
		$(result).each(function () {
			$('#tbl_performanceteam tfoot tr').append(('<td class=\"align-center\">' + this + '</td>'))
		});
		//Performance Details Table - End

		//Interaction Details Table - Start
		var _serviceFilterQuery = "SELECT queueName,channel, SUM(answered) as answered, "
		+ "SUM(transferredAccepted) as transferredAccepted, SUM(transferredInitiated) as transferredInitiated, SUM(acw) as acw,"
		+ "SUM(holds) as holds, SUM(averageTalkTime) as averageTalkTime, SUM(averageHoldTime) as averageHoldTime, SUM(averageWrapTime) as averageWrapTime, SUM(averageHandleTime) as averageHandleTime,"
		+ "SUM(acwDuration) as acwDuration, SUM(holdDuration) as holdDuration FROM ? GROUP BY  queueName, channel";
		//changed serviceDetailsList to accountDetails
		var serviceDetailsList = alasql(_serviceFilterQuery, [agentList.serviceDetailsList]);
		$("#tbl_interactiondetails > tbody").html("");
		if(serviceDetailsList.length > 0){
		var html_interaction = "";
		for (var j = 0; j < serviceDetailsList.length; j++) {
		   if(serviceDetailsList[j].answered > 0 ){	
			html_interaction += "<tr class=\"parent service_" + j + "\" id=\'parent_" + j + "\'>";
			html_interaction += "<td class=\"table-tooltip\" data-label=\"Channel\" >" + cleanHTML(serviceDetailsList[j].channel) + "</td>";
            html_interaction += "<td class=\"perentCell\" style=\"white-space: nowrap\" data-label=\"QueueName\">" + cleanHTML(serviceDetailsList[j].queueName) + "</td>";
			html_interaction += "<td class=\"perentCell align-center\" data-label=\"Answered\">" + cleanHTML(serviceDetailsList[j].answered) + "</td>";
            html_interaction += "<td class=\"perentCell align-center\" data-label=\"AverageTalkTime\">" + cleanHTML(convert_time(serviceDetailsList[j].averageTalkTime)) + "</td>";
			html_interaction += "<td class=\"perentCell align-center\" data-label=\"AverageHoldTime\">" + cleanHTML(convert_time(serviceDetailsList[j].averageHoldTime)) + "</td>";
            html_interaction += "<td class=\"perentCell align-center\" data-label=\"AverageWrapTime\">" + cleanHTML(convert_time(serviceDetailsList[j].averageWrapTime)) + "</td>";
            html_interaction += "<td class=\"perentCell align-center\" data-label=\"AverageHandleTime\">" + cleanHTML(convert_time(serviceDetailsList[j].averageHandleTime)) + "</td>";
          	html_interaction += "</tr>";
		   }
		}
		$('#tbl_interactiondetails > tbody').append(html_interaction);
		$('#tbl_interactiondetails > tfoot').html("");
		var result1 = [];
		$('#tbl_interactiondetails tbody > tr').each(function () {
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
		result1[result1.length - 1] = calculateTotalAgentHandleTime();;
		result1[result1.length - 2] = convert_time((totalAnsweredContact + totalTransferedAccepted) == 0 ? 0 : (totalAcwTimeDuration / (totalAnsweredContact + totalTransferedAccepted)));
		result1[result1.length - 3] = convert_time((totalAnsweredContact + totalTransferedAccepted) == 0 ? 0 : (totalHoldTimeDuration / (totalAnsweredContact + totalTransferedAccepted)));
		result1[result1.length - 4] = convert_time((totalAnsweredContact + totalTransferedAccepted) == 0 ? 0 : (totalActiveTimeDuration / (totalAnsweredContact + totalTransferedAccepted)));
		$('#tbl_interactiondetails > tfoot').append(('<tr></tr>'));
		$(result1).each(function () {
			$('#tbl_interactiondetails tfoot tr').append(('<td class=\"align-center\">' + this + '</td>'))
		});
		}
		//Interaction Details Table - End
		//AUX Summary Table - Start
		$("#tbl_AUXSummary > tbody").html("");
		var html_aux = "";
		for (var k = 0; k < agentList.auxDetailsList.length; k++) {
		   if(agentList.auxDetailsList[k].auxCount > 0 ){ 	
			html_aux += "<tr class=\"parent service_" + k + "\" id=\'parent_" + k + "\'>";
            html_aux += "<td class=\"perentCell align-center\" data-label=\"AuxName\">" + cleanHTML(agentList.auxDetailsList[k].auxName) + "</td>";
			html_aux += "<td class=\"perentCell align-center\" data-label=\"AuxCount\">" + cleanHTML(agentList.auxDetailsList[k].auxCount) + "</td>";
            html_aux += "<td class=\"perentCell align-center\" data-label=\"AuxDuration\">" + cleanHTML(agentList.auxDetailsList[k].auxDuration) + "</td>";
			html_aux += "</tr>";
		   }
		}
		$('#tbl_AUXSummary > tbody').append((html_aux));
		$('#tbl_AUXSummary > tfoot').html("");
		var result2 = [];
		$('#tbl_AUXSummary tbody > tr').each(function () {
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
		result2[0] = "Total";
		result2[result2.length - 1] = convert_time(result2[result2.length - 1]);
		if(result2[0] == "NaN:NaN:NaN"){
			result2[0] ="Total";
			result2[1] ="0";
			result2[2] ="00:00:00";
		}
		$('#tbl_AUXSummary > tfoot').append(('<tr></tr>'));
		$(result2).each(function () {
			$('#tbl_AUXSummary tfoot tr').append(('<td class=\"align-center\">' + this + '</td>'))
		});
		//AUX Summary Table - End
}
function bindAgentDashboardDetailList(agentList) {
	var _list = [];
	var _accountList = [];
	var _serviceList = [];
	var _auxList = [];
	var _serviceName = '';

	totalAnsweredContact = 0;
	totalTransferedAccepted = 0;
	totalAcwCount = 0;
	totalHoldCount = 0;
	totalActiveTimeDuration = 0;
	totalAcwTimeDuration = 0;
	totalHoldTimeDuration = 0;
	for (var i = 0; i < agentList.length; i++) {
		if (agentList[i] == null || agentList[i] == undefined) {
			return _list;
		}
		var _jsonValues = JSON.parse(agentList[i].agentMeasures);
		var _jsonAccountList = agentList[i].agentAccountMeasures;
		if(_jsonAccountList != null || _jsonAccountList != undefined) {
			_accountList = [];
			for (var j = 0; j < _jsonAccountList.length; j++) {
				var _jsonAccountValues = JSON.parse(_jsonAccountList[j].accountMeasures);
				var _channel = '';
				var _source = '';
				if(_jsonAccountValues.routingAttributeService != undefined){
					var _attributes = _jsonAccountValues.routingAttributeService.split("|");
					for(var attribute of _attributes){
						var _attrSplit = attribute.split(".");
						if(_attrSplit[0] == "Channel")
							_channel =_attrSplit[1];
					}		
				}
				
				if (_jsonAccountValues != null || _jsonAccountValues != undefined) {
					totalAnsweredContact = (_jsonAccountValues.answered == undefined ? totalAnsweredContact : totalAnsweredContact + _jsonAccountValues.answered);		
					totalTransferedAccepted = (_jsonAccountValues.transferredAccepted == undefined ? totalTransferedAccepted : totalTransferedAccepted + _jsonAccountValues.transferredAccepted);
					totalAcwCount = _jsonAccountValues.acw == undefined ? totalAcwCount : totalAcwCount + _jsonAccountValues.acw;
					totalHoldCount = _jsonAccountValues.holds == undefined ? totalHoldCount : totalHoldCount + _jsonAccountValues.holds;
					totalActiveTimeDuration = _jsonAccountValues.activeTimeDuration == undefined ? totalActiveTimeDuration : totalActiveTimeDuration + _jsonAccountValues.activeTimeDuration;
					totalAcwTimeDuration = _jsonAccountValues.acwDuration == undefined ? totalAcwTimeDuration : totalAcwTimeDuration +  _jsonAccountValues.acwDuration;
					totalHoldTimeDuration = _jsonAccountValues.holdDuration == undefined ? totalHoldTimeDuration : totalHoldTimeDuration + _jsonAccountValues.holdDuration;
					var _answeredContacts = (_jsonAccountValues.answered == undefined ? 0 : _jsonAccountValues.answered + (_jsonAccountValues.transferredAccepted == undefined ? 0 : _jsonAccountValues.transferredAccepted));
					var accountDetails = {
						channel : _channel == '' ? _jsonAccountValues.channelName : _channel,
						answered :_jsonAccountValues.answered == undefined ? 0 : _jsonAccountValues.answered ,
						transferAccepted :_jsonAccountValues.transferredAccepted == undefined ? 0 : _jsonAccountValues.transferredAccepted ,
						transferInitiated :_jsonAccountValues.transferredInitiated == undefined ? 0: _jsonAccountValues.transferredInitiated ,
						averageTalkTime: convert_time(((_answeredContacts == 0 || _jsonAccountValues.activeTimeDuration == undefined) ? 0 : (_jsonAccountValues.activeTimeDuration / (_answeredContacts)))),
						averageHoldTime: convert_time(((_answeredContacts ==  0 || _jsonAccountValues.holdDuration == undefined)  ? 0 : (_jsonAccountValues.holdDuration / _answeredContacts))),
						averageWrapTime: convert_time(((_answeredContacts ==  0 || _jsonAccountValues.acwDuration == undefined)? 0 : (_jsonAccountValues.acwDuration / _answeredContacts))),
						averageHandleTime: convert_time(((_answeredContacts == 0 || _jsonAccountValues.activeTimeDuration == undefined) ? 0 : (_jsonAccountValues.activeTimeDuration / (_answeredContacts)))  
							+ ((_jsonAccountValues._answeredContacts == undefined || _jsonAccountValues._answeredContacts == 0 || _jsonAccountValues.holdDuration == undefined) ? 0 : (_jsonAccountValues.holdDuration / _answeredContacts))
							+ ((_jsonAccountValues._answeredContacts == undefined ||_jsonAccountValues._answeredContacts == 0 || _jsonAccountValues.acwDuration == undefined) ? 0 : (_jsonAccountValues.acwDuration / _answeredContacts))),
						concurrency: "NA",
						outboundCalls:_jsonAccountValues.personalOutboundContacts == undefined ? 0 : _jsonAccountValues.personalOutboundContacts ,
						outboundDuration:convert_time(_jsonAccountValues.personalOutboundDuration == undefined ? 0 : _jsonAccountValues.personalOutboundDuration),
						holdCount:_jsonAccountValues.holds == undefined ? 0 : _jsonAccountValues.holds ,
						holdDuration:convert_time(_jsonAccountValues.holdDuration == undefined ? 0 : _jsonAccountValues.holdDuration) ,
						accountId :_jsonAccountList[j].accountId == undefined ?'-' : _jsonAccountList[j].accountId,
						rountingService : _jsonAccountValues.routingAttributeService == undefined ?'-' : _jsonAccountValues.routingAttributeService,
						accountState : _jsonAccountValues.accountState == undefined ?'-' : _jsonAccountValues.accountState,
						complete: (_jsonAccountValues.completed == undefined ? 0 : _jsonAccountValues.completed),
						consultInitiatedToService: (_jsonAccountValues.consultsInitiatedToService == undefined ? 0 :parseInt(_jsonAccountValues.consultsInitiatedToService)),
						consultAcceptedFromService: (_jsonAccountValues.consultsAcceptedFromService == undefined ? 0 :parseInt(_jsonAccountValues.consultsAcceptedFromService)),				
						occupancy : "NA"
					}
					_accountList.push(accountDetails);
				}
			}
		}
		var _jsonServiceList = agentList[i].routingServiceMeasures;
		if(_jsonServiceList != null || _jsonServiceList != undefined) {
			_serviceList = [];
			for (var k = 0; k < _jsonServiceList.length; k++) {
				var _jsonServiceValues = JSON.parse(_jsonServiceList[k].routingServiceMeasureData);
				var _channelName = '';
				var _sourceName = '';
				if(_jsonServiceValues.routingAttributeService != undefined){
					var _attributes = _jsonServiceValues.routingAttributeService.split("|");
					for(var attribute of _attributes){
						var _attrSplit = attribute.split(".");
						if(_attrSplit[0] == "Channel")
							_channelName =_attrSplit[1];
					}

				}
				for (var s in serviceGroupList) {
					_serviceName = '';
					if (serviceGroupList[s].serviceName == _jsonServiceList[k].routingServiceName) {
						_serviceName = serviceGroupList[s].typeDescription;
						break;
					}
				}
				//if(_serviceName.includes("VO_")) {
				//	_serviceName = removeLastWord(_serviceName);
				//}
				if (_jsonServiceValues != null || _jsonServiceValues != undefined) {
					var _answeredContacts = (_jsonServiceValues.answered == undefined ? 0 : _jsonServiceValues.answered + (_jsonServiceValues.transferredAccepted == undefined ? 0 : _jsonServiceValues.transferredAccepted));
					var serviceDetails = {
						channel: _channelName == '' ?  _jsonServiceValues.channel : _channelName,
						queueName: _serviceName == '' ?  _jsonServiceValues.routingAttributeService : _serviceName,
						answered: _jsonServiceValues.answered == undefined ? 0 : _jsonServiceValues.answered,
						averageTalkTime: ((_answeredContacts == 0 || _jsonServiceValues.activeTimeDuration == undefined) ? 0 : (_jsonServiceValues.activeTimeDuration / _answeredContacts)),
						averageHoldTime: ((_answeredContacts == 0 || _jsonServiceValues.holdDuration == undefined)  ? 0 : (_jsonServiceValues.holdDuration / _answeredContacts)),
						averageWrapTime: ((_answeredContacts == 0 || _jsonServiceValues.acwDuration == undefined)? 0 : (_jsonServiceValues.acwDuration / _answeredContacts)),
						averageHandleTime: ((_answeredContacts == 0 || _jsonServiceValues.activeTimeDuration == undefined) ? 0 : (_jsonServiceValues.activeTimeDuration / (_answeredContacts))  
							+ ((_jsonServiceValues._answeredContacts == undefined || _jsonServiceValues._answeredContacts == 0 || _jsonServiceValues.holdDuration == undefined) ? 0 : (_jsonServiceValues.holdDuration / _answeredContacts))
							+ ((_jsonServiceValues._answeredContacts == undefined ||_jsonServiceValues._answeredContacts == 0 || _jsonServiceValues.acwDuration == undefined) ? 0 : (_jsonServiceValues.acwDuration / _answeredContacts)))
					}
					_serviceList.push(serviceDetails);

				}
			}
		}

		var _jsonAuxList = agentList[i].agentAUXCodeMeasures;
		if(_jsonAuxList != null || _jsonAuxList != undefined) {
			_auxList = [];
			for (var l = 0; l < _jsonAuxList.length; l++) {
				var _jsonAuxValues = JSON.parse(_jsonAuxList[l].auxMeasureData);
				if (_jsonAuxValues != null && _jsonAuxValues != undefined && _jsonAuxValues.nrReasonCode != 'N/A') { 
					var _duration = (_jsonAuxValues.agentNRReasonCodeTimeDuration == undefined ? 0 : _jsonAuxValues.agentNRReasonCodeTimeDuration);
					var auxDetails = {
						auxCode: _jsonAuxValues.nrReasonCode == "N/A" ? "Not Available" : _jsonAuxValues.nrReasonCode,
						auxName: _jsonAuxValues.nrReasonCodeName== "N/A" ? "Not Available" : _jsonAuxValues.nrReasonCodeName,
						auxCount: _jsonAuxValues.nrReasonCodeOccurrence == undefined ? 0 :  _jsonAuxValues.nrReasonCodeOccurrence,
						auxDuration: calculateAgentNotReadyDuration(_duration,_jsonAuxValues.nrReasonCodeEffectiveDT,_jsonValues.agentState,_jsonValues.nrReasonCode, _jsonAuxValues.nrReasonCode),
					}
					_auxList.push(auxDetails);
				}
			}
		}
		var _agentMeasures = JSON.parse(agentList[i].agentMeasures);
		var agentDetails = {
			agentDisplayName: _jsonValues.agentDisplayName == undefined ? '-' : _jsonValues.agentDisplayName,
			agentId: _jsonValues.agentId == undefined ? '-' : _jsonValues.agentId,
			agentState: _jsonValues.agentState  == undefined ? '-' : _jsonValues.agentState,
			nrReasonName: _jsonValues.nrReasonCodeName  == undefined ? '-' : _jsonValues.nrReasonCodeName,
			currentStateDuration: calculateAgentStateDuration(_agentMeasures.lastStateChangeUserTimestamp),
			totalLoginDuration: calculateAgentLogonDuration(_agentMeasures.agentLogonDuration,_agentMeasures.loginTimeStamp,_jsonValues.agentState),
			accountDetails : _accountList,
			serviceDetailsList : _serviceList,
			auxDetailsList : _auxList,
		}
		_list.push(agentDetails);
	}
	return _list;
}


function getRoutingServiceList() {
	$("#main").html("");
	var _request={
		"serviceName" : "getRoutingServiceListDesc",
		"requestData" : ""
	}
	$.ajax({
		url: WidgetMiddlewareURL + "DBPostRequest",	
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
		success: function (data) {
			serviceGroupList = data;
		},
		failure: function () {
			alert("Failed!");
		}
	});
}

function calculateTotalAgentHandleTime() {
	var _avghandle = ((totalAnsweredContact + totalTransferedAccepted) == 0 ? 0 : ((totalActiveTimeDuration / (totalAnsweredContact + totalTransferedAccepted))) +
		 (totalHoldCount == 0 ? 0 : (totalHoldTimeDuration / (totalAnsweredContact + totalTransferedAccepted))) + 
		 (totalAcwCount == 0 ? 0 : (totalAcwTimeDuration / (totalAnsweredContact + totalTransferedAccepted))));
	return convert_time(_avghandle);
}
function calculateAgentStateDuration(_jsonVal) {
	if (_jsonVal == undefined || _jsonVal == "0") {
		return "00:00:00";
	}
	var startDate = new Date(parseInt(_jsonVal));
	var endDate = new Date();
	var num = (endDate.getTime() - startDate.getTime()) / 1000;
	return convert_time(num);
}
function calculateAgentLogonDuration(duration, timestamp,agentState) {
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
	if ( agentState != 'NOT_READY' || _agentMeasureAuxCode != _auxCodeMeasureCode) {
		return convert_time(duration);
	}
	var startDate = new Date(parseInt(timestamp));
	var endDate = new Date();
	var num = (endDate.getTime() - startDate.getTime()) / 1000;
	num = (duration == undefined ? num : parseInt(duration) + num);
	return convert_time(num);
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

function removeLastWord(str) {
	const lastIndexofUnderscore = str.lastIndexOf('_');
	if(lastIndexofUnderscore === -1) {
		return str;
	}
	return str.substring(0,lastIndexofUnderscore);
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
	var _hms = number.split(':'); 
	if (number == undefined) {
		return 0;
	}
	if(_hms.length == 0 || _hms.length == 1) {
		if(typeof number === 'string' || number instanceof String)
			return parseFloat(number);
		else 
			return number;
	}
	var seconds = (+_hms[0]) * 60 * 60 + (+_hms[1]) * 60 + (+_hms[2]);
	return parseInt(seconds);
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


/** * Event Listener to Dashboard Refresh - Start */
window.addEventListener('message', function (event) {
	WriteLog(INFO, "Listener for Dashboard --> START");
	//WriteLog(INFO, event.data);
	if (event.data.message.toString() == "DashboardInfo") {

		WriteLog(INFO, "Dashboard Refresh Event Received Successfully");
		refreshAgentDashboard = event.data.refresh;
		dashboard = event.data.dashboardId;
	}
});

function refreshAgentDashboardEvent() {
	if (refreshAgentDashboard && dashboard == 'DASHBOARD_005') {
		get_response_agent();
	}
	objTimeount = setTimeout(function () {
		refreshAgentDashboardEvent();
	}, autoRefreshTime * 1000);
}

/** * Event Listener to Dashboard Refresh - End */
