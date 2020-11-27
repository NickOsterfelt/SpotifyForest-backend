/** Routes for users. */

const express = require("express");
const router = express.Router();

const Track = require("../models/tracks");

const SpotifyAPI = require("../models/SpotifyAPI")

/** GET / => {users: [user, ...]} */
router.get("/", async function (req, res, next) {
  try {
    const tracks = await Track.findAll();
    return res.json({ tracks });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const track = await SpotifyAPI.getTrackDetails(req.body.access_token);

    const data = {
      id: item.id,
      name: item.name,
      image_url: item.album.images.length === 0 ? null : item.album.images[0],
      spotify_url: item.external_urls.spotify ? item.external_urls.spotify : null,
      artist_id: item.artists[0].id,
      artist_name: item.artists[0].name
    };
    //If track exists, update. Else add new track (shouldn't happen really);
    const exists = await Track.exists(id);
    if (exists) {
      Track.update(data);
    }
    else {
      Track.add(data);
    }
    return res.json({ track });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
