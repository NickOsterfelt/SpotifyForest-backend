const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate");

/** Related functions for artists. */

class Artist {

  /** Add artist with data. Returns new artist data. */

  static async add(data) {
    const result = await db.query(
        `INSERT INTO artists 
            (id, artist_name, image_url, spotify_url) 
          VALUES ($1, $2, $3, $4) 
          RETURNING id, artist_name, image_url, spotify_url`,
        [
          data.id,
          data.artist_name,
          data.image_url,
          data.spotify_url
        ]);

    return result.rows[0];
  }

  /** Find all artists. */

  static async findAll() {
    const result = await db.query(
        `SELECT id, artist_name, image_url, spotify_url
          FROM artists
          ORDER BY artist_name`);

    return result.rows;
  }
  static async exists(id) {
    const artistRes = await db.query(
      `SELECT id 
        FROM artists
        WHERE id = $1`,
        [id]);

    if(artistRes.rows.length === 0) {
      return false;
    }
    return true;
  }

  /** Given an id, return data about artist. */

  static async findOne(id) {
    const artistRes = await db.query(
        `SELECT id, artist_name, image_url, spotify_url
            FROM artists 
            WHERE id = $1`,
        [id]);

    const artist = artistRes.rows[0];

    if (!artist) {
      const error = new Error(`There exists no artist with id: '${id}'`);
      error.status = 404;   // 404 NOT FOUND
      throw error;
    }
    
    return artist;
  }

  /** Update artist data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed artist.
   *
   */

  static async update(id, data) {

    let {query, values} = partialUpdate(
        "artists",
        data,
        "id",
        id
    );

    const result = await db.query(query, values);
    const artist = result.rows[0];

    if (!artist) {
      let notFound = new Error(`There exists no artist with id: '${id}`);
      notFound.status = 404;
      throw notFound;
    }

    return result.rows[0];
  }

  /** Delete given artist from database; returns undefined. */

  static async remove(id) {
      let result = await db.query(
              `DELETE FROM artists 
                WHERE id = $1
                RETURNING id`,
              [id]);

    if (result.rows.length === 0) {
      let notFound = new Error(`There exists no artist with id: '${id}'`);
      notFound.status = 404;
      throw notFound;
    }
  }
}


module.exports = Artist;
