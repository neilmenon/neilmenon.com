window.addEventListener('DOMContentLoaded', () => {
    updateListeningActivity();
    getRecentlyWatched();
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

function getRecentlyWatched() {
    $.get(`/imdb.json?t=${Date.now()}`, function(payload) {
        let data = JSON.parse(JSON.stringify(payload))
        let movie = data?.latest
        if (movie) {
            $("#movie").html(`<span style="float: left;"> <a href="${movie.link}" target="_blank" title="${movie.description}"><img src="${movie.image_url}" style="max-height: 96px;"></a> </span> <div style="float: right;" class="movie-details"> <span style="font-weight: 900;"></span>${movie.title}<br> <span>${movie.year} • ${movie.rating} • ${movie.genres.join(", ")}</span><br> <span title="Director"><i class="fa fa-user" aria-hidden="true"></i> ${movie.director} • <span title="Votes: ${shortNumber(movie.votes.replaceAll(",", ""))}">IMDB: ${movie.imdb_rating}</span></span><br> <span title="Rated/watched on ${moment(movie.rated_on).format("MMMM Do, YYYY")}"><u>My Rating</u>: ${movie.my_rating} — "${getRatingDescriptor(movie.my_rating)}" • <i class="fas fa-clock"></i> ${moment(movie.rated_on).format("MMM Do")}</span><br></div>`)
        } else {
            $("#movie").html()
        }
    })
}

function shortNumber(number) {
    if (isNaN(number)) return null; // will only work value is a number
    if (number === null) return null;
    if (number === 0) return null;
    let abs = Math.abs(number);
    const rounder = Math.pow(10, 1);
    const isNegative = number < 0; // will also work for Negetive numbers
    let key = '';

    const powers = [
        {key: 'Q', value: Math.pow(10, 15)},
        {key: 'T', value: Math.pow(10, 12)},
        {key: 'B', value: Math.pow(10, 9)},
        {key: 'M', value: Math.pow(10, 6)},
        {key: 'K', value: 1000}
    ];

    for (let i = 0; i < powers.length; i++) {
        let reduced = abs / powers[i].value;
        reduced = Math.round(reduced * rounder) / rounder;
        if (reduced >= 1) {
            abs = reduced;
            key = powers[i].key;
            break;
        }
    }
    return (isNegative ? '-' : '') + abs + key;
}

function getRatingDescriptor(rating) {
    let ratingDescriptors = {
        "1": "Worst",
        "2": "???",
        "3": "Unacceptable",
        "4": "Bad",
        "5": "Mediocre",
        "6": "Passable",
        "7": "Good",
        "8": "Solid",
        "9": "Almost Perfect",
        "10": "Transcendent",
    }
    return ratingDescriptors[rating]
}

let vh = window.innerHeight * 0.01
document.body.style.setProperty('--vh', `${vh}px`)
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01
    document.body.style.setProperty('--vh', `${vh}px`)
})

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