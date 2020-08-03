// load in nav and footer
window.onload = function () {
  $.get("nav.html", function (data) {
    $("#nav").html(data);
  });
  $.get("footer.html", function (data) {
    $("#footer").html(data);
  });
};

// swiper.js 
var mySwiper = new Swiper('.swiper-container', {
    observer: true, 
    observeParents: true,
    loop: true,
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

  })

// particlesJS.load(@dom-id, @path-json, @callback (optional)); 
particlesJS.load('hero-particles', 'js/particles.json', function() {
  console.log('callback - particles.js config loaded');
});