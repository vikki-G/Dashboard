$(document).on("click", '.tab-container .tab-header-container .tab-head-list > li > p.tab-switcher', function () {
    var tabSwitchVal = $(this).data("tab-index");
    $(this).parent("li").addClass("tab-switcher-active").siblings().removeClass("tab-switcher-active");
    $('.tab-container .tab-body-container .tab-body[data-tab-body = ' + tabSwitchVal + ']').addClass("tab-body-active").siblings().removeClass("tab-body-active");
 });