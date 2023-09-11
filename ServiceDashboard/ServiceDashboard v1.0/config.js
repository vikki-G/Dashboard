
var DEBUG = 'DEBUG';
var INFO = 'INFO';
var ERROR = 'ERROR';
var WARNING = 'WARNING';
var WIDGET_NAME = "CUSTOMER HISTORY"
var IS_CONSOLE_LOG_ENABLE = true;

var KafkaMiddlewareURL = "https://bahocrtdash.menacorp.com:8443/KafkaRealtimeDashboard/";
var WidgetMiddlewareURL = "https://bahocrtdash.menacorp.com:8443/CustomWidgetMiddleware/";


var enableAutoRefresh = true;
var autoRefreshTime = 5; //In Seconds

var currentMonth = new Date().getMonth();
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

var queue_properties =
{
	"serviceDisplayName": "Service Name",
	"contactsWaiting": "No of calls in Queue",
	"available": "Total Agents",
	"contactsAtAgent": "Active Agents", //active 
	"heldContacts": "Interactions on Hold",
	"averageHandlingTime": "Average Handling Time",
};
