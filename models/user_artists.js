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
            `SELECT user_id, artist_id,
              FROM user_artists
              WHERE user_id = $1`,
            [userId]);

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

}

module.exports = UserArtist;