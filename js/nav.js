// load in nav and footer
$(function () {
    $.get("nav.html", function (data) {
        $("#nav").html(data);
    });
    $.get("footer.html", function (data) {
        $("#footer").html(data);
    });
});