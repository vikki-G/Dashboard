//single select dropdown with search
$(document).ready(function () {
    $(".dropdown-container .input-text, .dropdown-container .dropdown-icon-btn").click(function (e) {
        $(this).parent(".dropdown-container").toggleClass("active-dropdown").closest("li").siblings("li").find(".dropdown-container").removeClass("active-dropdown");
    });
    $(document).on("click", ".dropdown-container .dropdown-list-container .singleselect-dropdown-list li data", function () {
        var dropdownParenteleID = $(this).closest(".dropdown-container").attr("id");
        var selectVal = $(this).text();
        $(this).parent("li").addClass("active").siblings("li").removeClass("active").closest(".dropdown-container").removeClass("active-dropdown");
        $("#" + dropdownParenteleID + ".dropdown-container .input-text").val(selectVal);
        $(".dropdown-container #inputsearch").val("");
        $(".dropdown-container .dropdown-list-container .singleselect-dropdown-list li:nth-child(n+2)").show();
    });
});
$(document).on("click", function (e) {
    var edroptarget = ".dropdown-container .input-text, .dropdown-container .dropdown-icon-btn, .dropdown-container #inputsearch"
    if ($(e.target).is(edroptarget) === false) {
        $(".dropdown-container").removeClass("active-dropdown");
        $(".dropdown-container #inputsearch").val("");
        $(".dropdown-container .dropdown-list-container .singleselect-dropdown-list li:nth-child(n+2)").show();
    }
});
$(document).on("keyup", ".dropdown-container .dropdown-list-container #inputsearch", function () {
    var dropdownParenteleID = $(this).closest(".dropdown-container").attr("id");
    var value = this.value.toLowerCase().trim();
    $("#" + dropdownParenteleID + ".dropdown-container .dropdown-list-container .singleselect-dropdown-list li").each(function (index) {
        if (!index)
            return;
        $(this).find("data").each(function () {
            var id = $(this).text().toLowerCase().trim();
            var not_found = (id.indexOf(value) == -1);
            $(this).closest('li').toggle(!not_found);
            return not_found;
        });
    });
});
//single select dropdown with search


//table search
$(document).on("keyup", ".report-table-container #inputsearch", function () {
    var tblSearchID = $(this).data("search-table");
    var tblbody = $("#" + tblSearchID + " tbody")
    var value = this.value.toLowerCase().trim();
    $("#" + tblSearchID + " tr").each(function (index) {
        if (!index)
            return;
        $(this).find("td").each(function () {
            var id = $(this).text().toLowerCase().trim();
            var not_found = (id.indexOf(value) == -1);

            $(this).closest('tr').toggle(!not_found);
            return not_found;
        });                
    });
    var tbodyrowhidden = $("#" + tblSearchID + " tbody tr:not([style*='display: none'])").length;
    var tblbodycolumnsize = $("#" + tblSearchID + " tbody tr td:last").index() + 1;
    if (tbodyrowhidden == "0") {
        if ($("#" + tblSearchID + " tbody tr:last-child").hasClass("norecordfound")) {
            return;
        } else {
            tblbody.append("<tr class='norecordfound' style='display: block;'><td colspan='" + tblbodycolumnsize + "' class='align-center'>No Record found</td></tr>");
        }
    } else {
        tblbody.find(".norecordfound").remove();
    }

});
//table search