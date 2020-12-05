const db = require("../db");
const partialUpdate = require("../helpers/partialUpdate");

/** Related functions for tracks. */

class Track {

  /** Register track with data. Returns new track data. */

  static async add(data) {
    const result = await db.query(
        `INSERT INTO tracks 
            (id, track_name, image_url, spotify_url, artist_id, artist_name) 
          VALUES ($1, $2, $3, $4, $5, $6) 
          RETURNING id, track_name, image_url, spotify_url, artist_id, artist_name`,
        [
          data.id,
          data.track_name,
          data.image_url,
          data.spotify_url,
          data.artist_id,
          data.artist_name
        ]);

    return result.rows[0];
  }

  /** Find all tracks. */

  static async findAll() {
    const result = await db.query(
        `SELECT id, track_name, image_url, spotify_url, artist_id, artist_name
          FROM tracks
          ORDER BY tracK_name`);

    return result.rows;
  }
  static async exists(id) {
    const trackRes = await db.query(
      `SELECT track_name
        FROM tracks
        WHERE id = $1`,
        [id]);

    if(trackRes.rows.length === 0) {
      return false;
    }
    return true;
  }

  /** Given an id, return data about track. */

  static async findOne(id) {
    const trackRes = await db.query(
        `SELECT id, image_url, spotify_url, artist_id, artist_name
            FROM tracks 
            WHERE id = $1`,
        [id]);

    const track = trackRes.rows[0];

    if (!track) {
      const error = new Error(`There exists no track with id: '${id}'`);
      error.status = 404;   // 404 NOT FOUND
      throw error;
    }

    //TODO: GET track TRACKS/ARTISTS/GENRES
    return track;
  }

  /** Update track data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed track.
   *
   */

  static async update(id, data) {

    let {query, values} = partialUpdate(
        "tracks",
        data,
        "id",
        id
    );

    const result = await db.query(query, values);
    const track = result.rows[0];

    if (!track) {
      let notFound = new Error(`There exists no track with id: '${id}`);
      notFound.status = 404;
      throw notFound;
    }

    return result.rows[0];
  }

}


module.exports = Track;
