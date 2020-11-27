/** Routes for users. */

const express = require("express");
const router = express.Router();

const Artist = require("../models/artists");

const SpotifyAPI = require("../models/SpotifyAPI")

/** GET / => {users: [user, ...]} */
router.get("/", async function (req, res, next) {
    try {
        const artists = await Artist.findAll();
        return res.json({ artists });
    } catch (err) {
        return next(err);
    }
});

router.get("/:id", async function (req, res, next) {
    try {
        const artist = await SpotifyAPI.getArtistDetails(req.body.access_token);

        const data = {
            id: item.id,
            name: item.name,
            image_url: item.images.length === 0 ? null : item.images[0],
            spotify_url: item.external_urls.spotify ? item.external_urls.spotify : null

        };
        //If artist exists, update. Else add new artist (shouldn't happen really);
        const exists = await Artist.exists(id);
        if (exists) {
            Artist.update(data);
        }
        else {
            Artist.add(data);
        }
        return res.json({ artist });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
