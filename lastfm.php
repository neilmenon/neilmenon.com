<?php

$api_key = ''; // Last.fm API key -- can be retrieved from https://last.fm/api/account/create
$username = ''; // your Last.fm username
$url = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' . $username . '&api_key=' . $api_key . '&limit=10&format=json';
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$resp = curl_exec($curl);
$tracks = json_decode($resp);
curl_close($curl);
echo json_encode($tracks->recenttracks->track);

?>
