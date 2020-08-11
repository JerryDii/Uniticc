// load in nav and footer
$(function () {
    $("head").append("<!--nav.css-->")
             .append('<link rel="stylesheet" href="/css/nav.css" />');
    
    $.get("nav.html", function (data) {
        $("#nav").html(data);
    });
    $.get("footer.html", function (data) {
        $("#footer").html(data);
    });
});