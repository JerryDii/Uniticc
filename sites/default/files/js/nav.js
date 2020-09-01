// load in nav and footer
$(function () {
    $.get("/sites/default/files/nav.html", function (data) {
        $("#nav").html(data);
    });
    $.get("/sites/default/files/footer.html", function (data) {
        $("#footer").html(data);
    });
});