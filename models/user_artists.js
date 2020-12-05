const db = require("../db");

class UserArtist {
    static async getByArtist(artistId) {
        const result = await db.query(
            `SELECT user_id, artist_id,
              FROM user_artists
              WHERE artist_id = $1`,
            [artistId]);

        return result.rows;
    }

    static async getByUser(userId) {
        const result = await db.query(
            `SELECT 
                user_tracks.track_id, 
                artists.artist_name,
                artists.spotify_url,
                artists.image_url
            FROM 
                user_tracks 
            JOIN 
                artists
            ON 
                user_tracks.track_id = artists.id 
            WHERE 
                user_id = '${userId}'
            `);

        return result.rows;
    }

    static async add(userId, artistId) {
        const result = await db.query(
            `INSERT INTO user_artists 
            (user_id, artist_id) 
          VALUES ($1, $2) 
          RETURNING user_id, artist_id`,
            [userId, artistId]
        );

        return result.rows[0];
    }

    static async exists(userId, artistId) {
        const result = await db.query(
            `SELECT 
                user_id
            FROM   
                user_artists
            WHERE 
                user_id = $1
            AND 
                artist_id = $2`
            , [userId, artistId]);

        if (result.rows.length === 0) {
            return false;
        }
        return true;
    }

}

module.exports = UserArtist;