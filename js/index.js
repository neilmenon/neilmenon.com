window.addEventListener('DOMContentLoaded', () => {
    moment.locale('en-short', {
        relativeTime: {
            future: 'in %s',
            past: '%s',
            s:  '%ds',
            ss: '%ds',
            m:  '1m',
            mm: '%dm',
            h:  '1h',
            hh: '%dh',
            d:  '1d',
            dd: '%dd',
            M:  '1mo',
            MM: '%dmo',
            y:  '1y',
            yy: '%dY'
        }
    });

    updateListeningActivity();
    getRecentlyWatched();
    getLatestConcert();
    getLatestCollectedCD();
    window.setInterval(function(){
        if (document.visibilityState == "visible") { // if the DOM is visible (currently on tab)
            updateListeningActivity();
        }
    }, 10000);
})

function updateListeningActivity() {
    $.get('/lastfm.php', function(data) {
        var track_html = ""
        var track = data?.tracks[0]
        if (!track) { return }
        
        var title = track.name
        var artist = track.artist['#text']
        var album = track.album['#text']
        var url = track.url
        var image = track.image[2]['#text']
        var played = ""
        var scrobble = ""
        if (typeof track.date !== "undefined") {
            
            var played = '<i class="fas fa-clock"></i> ' + moment.unix(track.date.uts).locale('en-short').fromNow() + ' • '
        } else {
            var played = ""
            scrobble = "listening"
        }

        var blacklistedGenres = [artist?.toLowerCase(), 'seen live', 'female vocalists', 'american', 'male vocalists', 'usa', 'all', 'under 2000 listeners', 'vocal', 'indie', 'pop', 'electronic', 'rock', 'hip hop', 'rap', 'folk', 'alternative', 'singer songwriter', 'british', 'emo']
        var genreFilterBlacklist = data?.genre?.toptags?.tag?.filter(x => !blacklistedGenres.includes(x?.name?.toLowerCase()))
        
        var genericGenres = ['indie', 'pop', 'electronic', 'rock', 'hip hop', 'rap', 'folk', 'alternative', 'singer songwriter']
        var genreFilterGeneric = data?.genre?.toptags?.tag?.filter(x => genericGenres.includes(x?.name?.toLowerCase()))
        var genre = genreFilterBlacklist.length ? genreFilterBlacklist[0].name : (genreFilterGeneric.length ? genreFilterGeneric[0].name : 'N/A')

        track_html = '<div><span style="float:left"> <a href="' + url + '" target="_blank" title="View this track on Last.fm"> <img title="Album Artwork" src="' + image + '" width="96px" height="96px"> </a> </span> <div class="movie-details" style="line-height: 21px; word-break: break-word; display: inline-block; max-width: 230px;"> <span class="' + scrobble + '" title="Track: ' + title + '"><strong>' + title + '</strong></span> <br> <span title="Artist: ' + artist + '"> <i class="fa fa-user" aria-hidden="true"></i> ' + artist + '</span> <br> <span title="Album: ' + album + '"><i class="fas fa-record-vinyl"></i> ' + album + '</span><br> ' + played + '<span title="Genre"><i class="fas fa-music"></i> ' + genre?.replace(/\b\w/g, l => l.toUpperCase()) + '</span></div></div>'
        document.getElementById("lastfm").innerHTML = track_html
    })
}

function getRecentlyWatched() {
    $.get(`/imdb.json?t=${Date.now()}`, function(payload) {
        let data = JSON.parse(JSON.stringify(payload))
        let movie = data?.latest
        let ratingStrings = []
        for (let i = 0; i < 10; i++) {
            ratingStrings.push(`${ i + 1 } - ${ getRatingDescriptor(i + 1) }`)
        }
        let ratingString = ratingStrings.join(", ")
        let starString = movie.stars.length > 2 ? [movie.stars[0], movie.stars[1]].join(", ") : movie.stars.join(", ")
        if (movie) {
            $("#movie").html(`<span style="float: left;"> <a href="${movie.link}" target="_blank" title="${movie.description}"><img title="${movie.title} Poster" src="${movie.image_url}" width="64px" height="96px"></a> </span> <div style="float: right;" class="movie-details"> <span style="font-weight: 900;" title="${movie.title}">${movie.title}</span><br> <span>${movie.year} • ${movie.rating} • <span title="Number of ratings on IMDB"><i class="fas fa-vote-yea"></i> ${movie.votes}</span> • <span title="IMDB rating">IMDB: ${movie.imdb_rating}</span><br> <span title="Director"><i class="fa fa-user" aria-hidden="true"></i> ${movie.director}</span> • <span title="Stars: ${movie.stars.join(", ")}"><i class="fas fa-users"></i> ${starString}</span></span><br> <span title="${ratingString}"><u>My Rating</u>: ${movie.my_rating} — "${getRatingDescriptor(movie.my_rating)}" • <i class="fas fa-clock"></i> ${moment(movie.rated_on).format("MMM Do")}</span><br></div>`)
        } else {
            $("#movie").html()
        }
    })
}

function getLatestConcert() {
    $.get(`/songkick.json?t=${Date.now()}`, function(payload) {
        let data = JSON.parse(JSON.stringify(payload))
        let concert = data
        let isHeadSupportOneLine = concert.headliner_artist.includes(", and ")
        if (isHeadSupportOneLine) {
            concert.supporting_artist = concert.headliner_artist.replace(concert.headliner_artist.split(",")[0] + ", ", "").replace(", and ", ", ")
            concert.headliner_artist = concert.headliner_artist.split(",")[0]
        }
        if (concert) {
            $("#concert").html(`<span style="float: left;"> <a href="${concert.sk_link}" target="_blank" title="View on Songkick"><img title="${concert.headliner_artist} Image" src="${concert.artist_image}" width="96px" height="96px"></a> </span> <div style="float: right;line-height: 21px; max-width: 230px" class="movie-details"> <span style="font-weight: 900;" title="${concert.headliner_artist}">${concert.headliner_artist}</span><br> <span title="Supporting Artist: ${concert.supporting_artist}">${concert.supporting_artist ? "w/ " + concert.supporting_artist : "N/A"}</span><br> <span title="Venue"><i class="fas fa-map-marker-alt"></i> ${concert.venue}</span><br> <span title="${concert.timestamp}"><i class="fas fa-clock"></i> ${moment(concert.timestamp).format("dddd, MMMM Do, YYYY")}</span><br></div>`)
        } else {
            $("#concert").html()
        }
    })
}

function getLatestCollectedCD() {
    $.get(`/discogs_collection.json?t=${Date.now()}`, function(payload) {
        let collection = JSON.parse(JSON.stringify(payload))
        let release = collection?.length ? collection[0] : null
        if (release) {
            $("#cd-collection").html(`<div> <div style="margin-right: 0.25rem;"><a href="${release.release_url}" target="_blank" title="View on Discogs"><img src="${release.image_url}" title="${release.release_title} Image" width="32px" height="32px"></a></div><div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${release.artist} - ${release.release_title} • ${release.year} • <span title="added to collection ${moment(release.date_added).locale('en-us').fromNow()}"><i class="fas fa-clock"></i> ${moment(release.date_added).locale('en-short').fromNow()}</span></div> </div>`)
        } else {
            $("#cd-collection").html()
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
        "9": "Outstanding",
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