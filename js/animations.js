var scroll =
  windows.requestAnimationFrame ||
  function (callback) {
    windows.setTimeout(callback, 1000 / 60);
  };

var images = document.querySelectorAll(".animate-on-scroll");

function loop() {
  images.forEach(function (image) {
    if (isElementInViewport(element)) {
      element.classList.add("is-visible");
    } else {
      element.classList.remove("is-visible");
    }
  });
  scroll(loop);
}

loop();

function isElementInViewport(element) {
  if (typeof jQuery === "function" && element instanceof jQuery) {
    element = element[0];
  }
  var rect = element.getBoundingClientRect();
  return (
    (rect.top <= 0 && rect.bottom >= 0) ||
    (rect.bottom >=
      (window.innerHeight || document.documentElement.clientHeight) &&
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight)) ||
    (rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight))
  );
}
