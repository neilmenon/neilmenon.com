let vh = window.innerHeight * 0.01;
document.body.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.body.style.setProperty('--vh', `${vh}px`);
});

const address = "nkm5gz", domain = "virginia.edu"
$("#mail a").attr("href", "mailto:" + address + "@" + domain)

$("#mail a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeOut(0)
    $("#socialsText").text("Send me an email")
    $("#socialsText").fadeIn(500)
}, function () {
    $("#socialsText").stop()
    $("#socialsText").fadeIn(0)
    $("#socialsText").fadeOut(500)
});
$("#github a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeOut(0)
    $("#socialsText").text("Check out my code on Github")
    $("#socialsText").fadeIn(500)
}, function () {
    $("#socialsText").stop()
    $("#socialsText").fadeIn(0)
    $("#socialsText").fadeOut(500);
});
$("#resume a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeOut(0)
    $("#socialsText").text("Check out my résumé")
    $("#socialsText").fadeIn(500)
}, function () {
    $("#socialsText").stop()
    $("#socialsText").fadeIn(0)
    $("#socialsText").fadeOut(500)
});
$("#linkedin a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeOut(0)
    $("#socialsText").text("Add me on Linkedin")
    $("#socialsText").fadeIn(500)
}, function () {
    $("#socialsText").stop()
    $("#socialsText").fadeIn(0)
    $("#socialsText").fadeOut(500)
});
$("#instagram a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeOut(0)
    $("#socialsText").text("Follow me on Instagram")
    $("#socialsText").fadeIn(500)
}, function () {
    $("#socialsText").stop()
    $("#socialsText").fadeIn(0)
    $("#socialsText").fadeOut(500)
});
$("#spotify a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeOut(0)
    $("#socialsText").text("Follow me on Spotify")
    $("#socialsText").fadeIn(500)
}, function () {
    $("#socialsText").stop()
    $("#socialsText").fadeIn(0)
    $("#socialsText").fadeOut(500)
});