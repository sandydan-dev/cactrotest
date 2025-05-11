const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotify.controller');

// Routes
router.get('/login', spotifyController.login);
router.get('/callback', spotifyController.callback);
router.get('/top-tracks', spotifyController.getTopTracks);
router.get('/now-playing', spotifyController.getNowPlaying);
router.get('/followed-artists', spotifyController.getFollowedArtists);
router.put('/play/:trackId', spotifyController.playTrack);
router.put('/pause', spotifyController.pauseTrack);

module.exports = router;
