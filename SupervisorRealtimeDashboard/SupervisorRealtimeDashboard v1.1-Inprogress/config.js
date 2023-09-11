
var DEBUG = 'DEBUG';
var INFO = 'INFO';
var ERROR = 'ERROR';
var WARNING = 'WARNING';
var WIDGET_NAME = "CUSTOMER HISTORY"
var IS_CONSOLE_LOG_ENABLE = true;
var KafkaMiddlewareURL = "https://BAHOCRTDASH.menacorp.com:8443/KafkaRealtimeDashboard/";
var WidgetMiddlewareURL = "https://bahocivrapp.menacorp.com:8444/MiddlewareInterface/";
var CustomWidgetMiddleware  = "https://bahocivrapp.menacorp.com:8444/MiddlewareInterface";
var ACMAPIURL  = "https://bahocivrapp.menacorp.com:8443/ACCMMama/accm/";


var enableAutoRefresh = true;
var autoRefreshTime = 5; //In Seconds



var currentMonth = new Date().getMonth();
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

var agentStateList= {
    "READY":"Ready",
    "NOT_READY":"Not Ready",
    "PENDING_NOT_READY":"Not Ready Pending",
    "LOGGED_IN":"Logged In",
    "PENDING_LOGGED_IN":"Login Pending",
    "LOGGED_OUT":"Logged Out"
}

var auxCodeDetails = [
    {"code": "0", "codeName": "Default"},
	{"code": "3", "codeName": "Tea/Coffee Break"},
	{"code": "18", "codeName": "System Issues"},
	{"code": "6", "codeName": "Department Meeting"},	
	{"code": "4", "codeName": "Lunch Break"},	
	{"code": "7", "codeName": "Training"}	
]
