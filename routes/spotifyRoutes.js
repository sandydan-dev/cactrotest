const express = require("express");
const router = express.Router();
const { login, callback, topTracks, nowPlaying, playTrack, pauseTrack } = require("../controllers/spotifyController");

router.get("/login", login);
router.get("/callback", callback);
router.get("/top-tracks", topTracks);
router.get("/now-playing", nowPlaying);
router.post("/play", playTrack);
router.post("/pause", pauseTrack);

module.exports = router;
