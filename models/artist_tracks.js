const db = require("../db");

class ArtistTrack {
    static async getByArtist(artistId) {
        const result = await db.query(
            `SELECT artist_id, track_id,
              FROM artists_tracks
              WHERE artist_id = $1`,
            [artistId]);

        return result.rows;
    }

    static async getBySong(trackId) {
        const result = await db.query(
            `SELECT artist_id, track_id,
              FROM artists_tracks
              WHERE track_id = $1`,
            [songId]);

        return result.rows;
    }

    static async add(songId, artistId) {
        const result = await db.query(
            `INSERT INTO artist_tracks 
            (track_id, artist_id) 
          VALUES ($1, $2) 
          RETURNING artist_id, track_id`,
          [songId, artistId] 
        );

        return result.rows[0];
    }
}

module.exports = ArtistTrack;