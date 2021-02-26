window.addEventListener('DOMContentLoaded', (event) => {
    updateListeningActivity();
    window.setInterval(function(){
        if (document.visibilityState == "visible") { // if the DOM is visible (currently on tab)
            updateListeningActivity();
        }
    }, 10000);
})

function updateListeningActivity() {
    $.get('/lastfm.php', function(data) {
        var track_html = []
        var tracks = JSON.parse(data)
        tracks.forEach(function(track, index) {
            var title = track.name
            var artist = track.artist['#text']
            var album = track.album['#text']
            var url = track.url
            var image = track.image[1]['#text']
            var played = ""
            var scrobble = ""
            if (typeof track.date !== "undefined") {
                var played = "Played " + moment.unix(track.date.uts).fromNow()
            } else {
                var played = "Listening now"
                scrobble = "listening"
            }
            track_html.push('<div style="height:77px"><span style="float:left"> <a href="' + url + '" target="_blank"> <img title="View this track on Last.fm" src="' + image + '"> </a> </span> <div class="lastfm-details"> <span class="' + scrobble + '" title="Track: ' + title + '"><strong>' + title + '</strong></span> <br> <span title="Artist: ' + artist + '"> <i class="fa fa-user" aria-hidden="true"></i> ' + artist + '</span> <br> <span class="album" title="Album: ' + album + '">' + album + '</span><br> </div></div> <div class="lastfm-played"><hr>' + played + '</div>')
        })
        document.getElementById("lastfm").innerHTML = track_html[0]
    })
}

let vh = window.innerHeight * 0.01
document.body.style.setProperty('--vh', `${vh}px`)
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01
    document.body.style.setProperty('--vh', `${vh}px`)
})

const address = "nkm5gz", domain = "virginia.edu"
$("#mail a").attr("href", "mailto:" + address + "@" + domain)

$("#mail a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 0.001)
    $("#socialsText").text("Send me an email")
    $("#socialsText").fadeTo(500, 1)
}, function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 1)
    $("#socialsText").fadeTo(500, 0.001)
})
$("#github a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 0.001)
    $("#socialsText").text("Check out my code on Github")
    $("#socialsText").fadeTo(500, 1)
}, function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 1)
    $("#socialsText").fadeTo(500, 0.001)
})
$("#resume a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 0.001)
    $("#socialsText").text("Check out my résumé")
    $("#socialsText").fadeTo(500, 1)
}, function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 1)
    $("#socialsText").fadeTo(500, 0.001)
})
$("#linkedin a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 0.001)
    $("#socialsText").text("Add me on Linkedin")
    $("#socialsText").fadeTo(500, 1)
}, function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 1)
    $("#socialsText").fadeTo(500, 0.001)
})
$("#instagram a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 0.001)
    $("#socialsText").text("Follow me on Instagram")
    $("#socialsText").fadeTo(500, 1)
}, function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 1)
    $("#socialsText").fadeTo(500, 0.001)
})
$("#spotify a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 0.001)
    $("#socialsText").text("Follow me on Spotify")
    $("#socialsText").fadeTo(500, 1)
}, function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 1)
    $("#socialsText").fadeTo(500, 0.001)
})
$("#lastfm-icon a").hover(function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 0.001)
    $("#socialsText").text("Follow me on Last.fm")
    $("#socialsText").fadeTo(500, 1)
}, function() {
    $("#socialsText").stop()
    $("#socialsText").fadeTo(0, 1)
    $("#socialsText").fadeTo(500, 0.001)
})