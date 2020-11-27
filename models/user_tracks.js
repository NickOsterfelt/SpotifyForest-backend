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
            `SELECT user_id, track_id,
              FROM user_tracks
              WHERE user_id = $1`,
            [userId]);

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
}

module.exports = UserTrack;