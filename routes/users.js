/** Routes for users. */

const express = require("express");
const router = express.Router();

const User = require("../models/users");
const Track = require("../models/tracks");
const Artist = require("../models/artists");
const ArtistTrack = require("../models/artist_tracks");
const UserTrack = require("../models/user_tracks");
const UserArtist = require("../models/user_artists");

const SpotifyAPI = require("../models/SpotifyAPI")

/** GET / => {users: [user, ...]} */
router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

router.get("/refresh-user/:id", async function (req, res, next) {
  try {
    let newToken = await SpotifyAPI.refreshUserToken(req.body.refresh_token);
    let id = req.params.id; //USE QUERYSTRING
    // let user = await User.update(id, {access_token: newToken})
    return res.json({ newToken });
  }
  catch (err) {
    return next(err)
  }
});

router.get("/curr-user", async function (req, res, next) {
  try {
    
    let user = await SpotifyAPI.getCurrUser(req.body.access_token);
    console.log(user);

    const data = {
      id: user.id,
      username: user.display_name,
      email: user.email,
      photo_url: user.images.length === 0 ? null : user.image[0],
      spotify_url: user.external_urls.spotify,
      access_token: req.body.access_token,
      refresh_token: req.body.refresh_token
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

router.get("/:id/tracks", async function (req, res, next) {
  try {
    const userId = req.params.id;
    //get user's top tracks from spotify api.
    const tracks = await SpotifyAPI.getTopTracks(req.body.access_token);
    //add artist top artist to artists table and user-artists
    for (let item of tracks.items) {
      let data = {
        id: item.id,
        name: item.name,
        image_url: item.album.images.length === 0 ? null : item.album.images[0],
        spotify_url: item.external_urls.spotify ? item.external_urls.spotify : null,
        artist_id: item.artists[0].id,
        artist_name: item.artists[0].name
      }
      //add or update artist in artists table.
      const exists = await Track.exists(item.id)
      if (exists) {
        await Track.update(item.id, data);
      }
      else {
        await Track.add(data);
      }
      //add to user-artists table`
      await UserTrack.add(userId, item.id);
    }
    return res.json({ tracks })
  }
  catch (err) {
    return next(err);
  }
});

router.get("/:id/artists", async function (req, res, next) {
  try {
    const userId = req.params.id;
    //get user's top artists from spotify api.
    const artists = await SpotifyAPI.getTopArtists(req.body.access_token);
    //add artist top artist to artists table and user-artists
    for (let item of artists.items) {
      let data = {
        id: item.id,
        name: item.name,
        image_url: item.images.length === 0 ? null : item.images[0],
        spotify_url: item.external_urls.spotify ? item.external_urls.spotify : null
      }
      //add or update artist in artists table.
      const exists = await Artist.exists(item.id)
      if (exists) {
        await Artist.update(item.id, data);
      }
      else {
        await Artist.add(data);
      }
      //add to user-artists table
      await UserArtist.add(userId, item.id);
    }

    return res.json({ artists })
  }
  catch (err) {
    return next(err);
  }
});
/** GET /[username] => {user: user} */

router.get("/:id", async function (req, res, next) {
  try {
    const user = await User.findOne(req.params.id);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:username", async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ message: "User deleted" });
  } catch (err) {
    return next(err);
  }
});



// /** POST / {userdata}  => {token: token} */

// router.post("/", async function (req, res, next) {
//   try {
//     delete req.body._token;
//     const validation = validate(req.body, userNewSchema);

//     if (!validation.valid) {
//       return next({
//         status: 400,
//         message: validation.errors.map(e => e.stack)
//       });
//     }

//     const newUser = await User.register(req.body);
//     const token = createToken(newUser);
//     return res.status(201).json({ token });
//   } catch (e) {
//     return next(e);
//   }
// });

/** DELETE /[handle]  =>  {message: "User deleted"}  */


module.exports = router;
