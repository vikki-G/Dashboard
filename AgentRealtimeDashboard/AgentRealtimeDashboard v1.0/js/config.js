
var DEBUG = 'DEBUG';
var INFO = 'INFO';
var ERROR = 'ERROR';
var WARNING = 'WARNING';
var WIDGET_NAME = "CUSTOMER HISTORY"
var IS_CONSOLE_LOG_ENABLE = true;
var KafkaMiddlewareURL = "https://bahocrtdash.menacorp.com:8443/KafkaRealtimeDashboard/";
 var WidgetMiddlewareURL = "https://bahocrtdash.menacorp.com:8443/CustomWidgetMiddleware/";
 var CustomWidgetMiddleware  = "https://bahocrtdash.menacorp.com:8443/CustomWidgetMiddleware/";


var enableAutoRefresh = true;
var autoRefreshTime = 5; //In Seconds



var currentMonth = new Date().getMonth();
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
var auxCodeDetails = [
	{"code": "0", "codeName": "Default"},
	{"code": "01", "codeName": "Short Break"},
	{"code": "02", "codeName": "IT Iusses"},
	{"code": "03", "codeName": "Lunch Break"},
	{"code": "04", "codeName": "Training"},
	{"code": "05", "codeName": "Meeting"},
	{"code": "06", "codeName": "Coaching"}
]

var agentStateList= {
    "READY":"Ready",
    "NOT_READY":"Not Ready",
    "PENDING_NOT_READY":"Not Ready Pending",
    "LOGGED_IN":"Logged In",
    "PENDING_LOGGED_IN":"Login Pending",
    "LOGGED_OUT":"Logged Out"
}
