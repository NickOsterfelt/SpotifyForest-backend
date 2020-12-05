/** Routes for users. */

const express = require("express");
const router = express.Router();

const User = require("../models/users");
const Track = require("../models/tracks");
const Artist = require("../models/artists");
const UserTrack = require("../models/user_tracks");
const UserArtist = require("../models/user_artists");
const UserGroup = require("../models/user_groups");
const { authRequired } = require("../middleware/auth");
const SpotifyAPI = require("../models/SpotifyAPI");

/** GET / => {users: [user, ...]} */
router.get("/", authRequired, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

router.post("/refresh-token", authRequired, async function (req, res, next) {
  try {
    let newToken = await SpotifyAPI.refreshUserToken(req.refresh_token);
    // let user = await User.update(id, {access_token: newToken})
    return res.json({ newToken });
  }
  catch (err) {
    return next(err)
  }
});



router.get("/:id/groups", authRequired, async function (req, res, next) {
  try {
    const groups = await UserGroup.getByUser(req.params.id)
    return res.json({ groups });
  }
  catch (err) {
    return next(err);
  }
});

router.get("/curr-user", authRequired, async function (req, res, next) {
  try {
    let user = await SpotifyAPI.getCurrUser(req.access_token);

    const data = {
      id: user.id,
      username: user.display_name,
      email: user.email,
      photo_url: user.images.length === 0 ? null : user.image[0],
      spotify_url: user.external_urls.spotify,
      access_token: req.access_token,
      refresh_token: req.refresh_token
    }

    //check if user already exists in users table
    const exists = await User.exists(user.id)
    if (exists) {
      //if so partial update.
      user = await User.update(user.id, data);
    }
    else {
      //if not add new user.
      user = await User.add(data);
    }

    return res.json({ user })
  }
  catch (err) {
    return next(err);
  }
});

/** GET /[username] => {user: user} */

router.get("/:id", authRequired, async function (req, res, next) {
  try {
    const user = await User.findOne(req.params.id);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:username", authRequired, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ message: "User deleted" });
  } catch (err) {
    return next(err);
  }
});

router.get("/tracks/:id", authRequired, async function (req, res, next) {
  try {
    const userId = req.params.id;
    const tracks = await UserTrack.getByUser(userId);
    return res.json({ tracks })
  }
  catch (err) {
    return next(err);
  }
});

router.get("/artists/:id", authRequired, async function (req, res, next) {
  try {
    const userId = req.params.id;
    const artists = await UserArtist.getByUser(userId);
    return res.json({ artists })
  }
  catch (err) {
    return next(err);
  }
});

router.get("/curr-user/tracks/:id", authRequired, async function (req, res, next) {
  try {
    const userId = req.params.id;
    //get user's top tracks from spotify api.
    let tracks = await SpotifyAPI.getTopTracks(req.access_token);
    //add artist top artist to artists table and user-artists
    for (let item of tracks.items) {
      let data = {
        id: item.id,
        track_name: item.name,
        image_url: item.album.images.length === 0 ? null : item.album.images[0],
        spotify_url: item.external_urls.spotify ? item.external_urls.spotify : null,
        artist_id: item.artists[0].id,
        artist_name: item.artists[0].name
      }
      //add or update artist in artists table.
      let exists = await Track.exists(item.id)
      if (exists) {
        await Track.update(item.id, data);
      }
      else {
        await Track.add(data);
      }
      //add to user-artists table`
      exists = await UserTrack.exists(userId, item.id)
      if (!exists) {
        await UserTrack.add(userId, item.id);
      }
    }
    tracks = tracks.items;
    return res.json({ tracks })
  }
  catch (err) {
    return next(err);
  }
});

router.get("/curr-user/artists/:id", authRequired, async function (req, res, next) {
  try {
    const userId = req.params.id;
    //get user's top artists from spotify api.
    let artists = await SpotifyAPI.getTopArtists(req.access_token);
    //add artist top artist to artists table and user-artists
    for (let item of artists.items) {
      let data = {
        id: item.id,
        artist_name: item.name,
        image_url: item.images.length === 0 ? null : item.images[0],
        spotify_url: item.external_urls.spotify ? item.external_urls.spotify : null
      }
      //add or update artist in artists table.
      let exists = await Artist.exists(item.id)
      if (exists) {
        await Artist.update(item.id, data);
      }
      else {
        await Artist.add(data);
      }
      //add to user-artists table
      exists = await UserArtist.exists(userId, item.id);
      if (!exists) {
        await UserArtist.add(userId, item.id);
      }
    }
    artists = artists.items;
    return res.json({ artists })
  }
  catch (err) {
    return next(err);
  }
});



module.exports = router;
