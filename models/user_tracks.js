const db = require("../db");

class UserTrack {
    static async getByTrack(trackId) {
        const result = await db.query(
            `SELECT user_id, track_id,
              FROM user_tracks
              WHERE track_id = $1`,
            [trackId]);

        return result.rows;
    }

    static async getByUser(userId) {
        const result = await db.query(
            `SELECT 
                user_tracks.track_id, 
                tracks.track_name,
                tracks.image_url,
                tracks.spotify_url,
                tracks.artist_id,
                tracks.artist_name
            FROM 
                user_tracks 
            JOIN 
                tracks 
            ON 
                user_tracks.track_id = tracks.id 
            WHERE 
                user_id = '${userId}'
            `);

        return result.rows;
    }

    static async add(userId, trackId) {
        const result = await db.query(
            `INSERT INTO user_tracks 
            (user_id, track_id) 
          VALUES ($1, $2) 
          RETURNING user_id, track_id`,
            [userId, trackId]
        );

        return result.rows[0];
    }

    static async exists(userId, trackId) {
        const result = await db.query(
            `SELECT 
                user_id
            FROM   
                user_tracks
            WHERE 
                user_id = $1
            AND 
                track_id = $2`
            , [userId, trackId]);

        if (result.rows.length === 0) {
            return false;
        }
        return true;
    }
}

module.exports = UserTrack;