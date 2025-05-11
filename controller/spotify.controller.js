const axios = require('axios');
const querystring = require('querystring');
const {
  getAccessToken,
  setAccessToken,
} = require('../utils/spotify');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

exports.login = (req, res) => {
  const scope =
    'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-top-read user-follow-read streaming';
  const authUrl =
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
    });
  res.redirect(authUrl);
};

exports.callback = async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        code,
        redirect_uri,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    // Save token in memory (can use DB or session in real-world)
    setAccessToken(access_token);

    res.json({ message: 'Auth successful', access_token });
  } catch (err) {
    console.error(err.response.data);
    res.status(500).json({ error: 'Auth failed' });
  }
};

exports.getTopTracks = async (req, res) => {
  try {
    const token = getAccessToken();
    const response = await axios.get(
      'https://api.spotify.com/v1/me/top/tracks?limit=10',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response.data);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
};

exports.getNowPlaying = async (req, res) => {
  try {
    const token = getAccessToken();
    const response = await axios.get(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data || { message: 'No track is currently playing' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch now playing' });
  }
};

exports.getFollowedArtists = async (req, res) => {
  try {
    const token = getAccessToken();
    const response = await axios.get(
      'https://api.spotify.com/v1/me/following?type=artist&limit=10',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch followed artists' });
  }
};

exports.pauseTrack = async (req, res) => {
  try {
    const token = getAccessToken();
    await axios.put(
      'https://api.spotify.com/v1/me/player/pause',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json({ message: 'Playback paused' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to pause playback' });
  }
};

exports.playTrack = async (req, res) => {
  try {
    const token = getAccessToken();
    const { trackId } = req.params;
    await axios.put(
      'https://api.spotify.com/v1/me/player/play',
      { uris: [`spotify:track:${trackId}`] },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json({ message: 'Track started playing' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to start playback' });
  }
};
