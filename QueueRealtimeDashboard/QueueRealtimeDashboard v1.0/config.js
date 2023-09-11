
var DEBUG = 'DEBUG';
var INFO = 'INFO';
var ERROR = 'ERROR';
var WARNING = 'WARNING';
var WIDGET_NAME = "CUSTOMER HISTORY"
var IS_CONSOLE_LOG_ENABLE = true;
var KafkaMiddlewareURL = "https://widgets.glb.emea.qccprod.avayacloud.com/KafkaRealtimeDashboard/";
var WidgetMiddlewareURL = "https://widgets.glb.emea.qccprod.avayacloud.com/CustomWidgetMiddleware/";
var CustomWidgetMiddleware  = "https://widgets.glb.emea.qccprod.avayacloud.com/CustomWidgetMiddleware/";


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
