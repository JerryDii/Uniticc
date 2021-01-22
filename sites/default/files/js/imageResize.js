/**
 * Displays different image sizes based on container width
 * @param	width			width of the container that the image is supposed to fill
 * @param	cssSelector		the CSS selector for the container
 * @param 	linearGradient	the linear gradient settings that already exist
 * @param 	baseURL			the base URL for the image set. For example, if a scaled image is "myImage-1920.jpg", the baseURL is "myImage"
 */
function imageResize(width, cssSelector, linearGradient, baseURL) {
	if (width > 1920) $(cssSelector).css('background-image', 'linear-gradient(' + linearGradient + '), url("' + baseURL + '-3840.jpg")');
	else if (width > 1600) $(cssSelector).css('background-image', 'linear-gradient(' + linearGradient + '), url("' + baseURL + '-1920.jpg")');
	else if (width > 1366) $(cssSelector).css('background-image', 'linear-gradient(' + linearGradient + '), url("' + baseURL + '-1600.jpg")');
	else if (width > 1024) $(cssSelector).css('background-image', 'linear-gradient(' + linearGradient + '), url("' + baseURL + '-1366.jpg")');
	else if (width > 768) $(cssSelector).css('background-image', 'linear-gradient(' + linearGradient + '), url("' + baseURL + '-1024.jpg")');
	else $(cssSelector).css('background-image', 'linear-gradient(' + linearGradient + '), url("' + baseURL + '-768.jpg")');
}

// This should trigger after nav and footer load.
$(() => {
    imageResize($("#hero")[0].offsetWidth, "#hero", "rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)", "/sites/default/files/images/home/hero-section-bg2");
    
    imageResize($("#facts")[0].offsetWidth, ".slideshow-1", "rgba(21, 21, 21, 0.281), rgba(21, 21, 21, 0.281)", "/sites/default/files/images/home/slideshow/clouds");
    
    imageResize($("#stay-updated")[0].offsetWidth, "#stay-updated", "rgba(21, 21, 21, 0.6), rgba(21, 21, 21, 0.6)", "/sites/default/files/images/home/abstract-bg");
});

//Lazy loaded images go here
window.onload = function() {
    /** $("#solution").css("backgroundImage", 'linear-gradient(rgba(18, 18, 18), rgba(18, 18, 18, 0.733)), url("/sites/default/files/images/home/solution-bg.png")');
    $("#answer").css("backgroundImage", 'linear-gradient(rgba(18, 18, 18, 0.733), rgba(18, 18, 18, 0.541)), url("/sites/default/files/images/home/answer-bg.png")'); */
    imageResize($("#facts")[0].offsetWidth, ".slideshow-2", "rgba(21, 21, 21, 0.281), rgba(21, 21, 21, 0.281)", "/sites/default/files/images/home/slideshow/mountain");
    imageResize($("#facts")[0].offsetWidth, ".slideshow-3", "rgba(21, 21, 21, 0.281), rgba(21, 21, 21, 0.281)", "/sites/default/files/images/home/slideshow/forest");
}