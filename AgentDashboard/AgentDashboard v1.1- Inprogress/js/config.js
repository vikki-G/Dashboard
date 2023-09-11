
var DEBUG = 'DEBUG';
var INFO = 'INFO';
var ERROR = 'ERROR';
var WARNING = 'WARNING';
var WIDGET_NAME = "CUSTOMER HISTORY"
var IS_CONSOLE_LOG_ENABLE = true;

var KafkaMiddlewareURL = "http://localhost:8082/KafkaRealtimeDashboard/";
var WidgetMiddlewareURL = "https://bahocivrapp.menacorp.com:8444/MiddlewareInterface/";

var enableAutoRefresh = true;
var autoRefreshTime = 5; //In Seconds

var currentMonth = new Date().getMonth();
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

var agent_properties =
{
	"agentLogonDuration": "Total Logged-in Duration",
	"agentNotReadyTimeDuration": "Total Not Ready Duration",
	"agentWorkTime": "Agent Work Time",
	"idleTimeDuration": "Total Idle Time",
	"agentNotReady": "Agent Not Ready Count",
	//"activeTimeDuration": "Total Active Time",
	"answered": "Contacts Answered",
	"transferredAccepted": "Transfer Accepted",
	"transferredInitiated": "Transfer Initiated",
	"occupancy" : "Occupancy %",
	"concurrency" : "Concurrency",
	"averageHandlingTime": "Average Handling Time",
	"averageWrapUpTime": "Average Wrap-up Duration",
	
};
