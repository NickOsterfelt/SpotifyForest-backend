const db = require("../db");
const bcrypt = require("bcrypt");
const partialUpdate = require("../helpers/partialUpdate");

const BCRYPT_WORK_FACTOR = 10;


/** Related functions for users. */

class User {

  /** authenticate user with username, password. Returns user or throws err. */

  static async authenticate(data) {
    // try to find the user first
    const result = await db.query(
        `SELECT username, 
                password, 
                first_name, 
                last_name, 
                email, 
                photo_url, 
                is_admin
          FROM users 
          WHERE username = $1`,
        [data.username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(data.password, user.password);
      if (isValid) {
        return user;
      }
    }

    const invalidPass = new Error("Invalid Credentials");
    invalidPass.status = 401;
    throw invalidPass;
  }

  /** Register user with data. Returns new user data. */

  static async add(data) {
    const result = await db.query(
        `INSERT INTO users 
            (id, username, email, photo_url, spotify_url, access_token, refresh_token) 
          VALUES ($1, $2, $3, $4, $5, $6, $7) 
          RETURNING id, username, email, photo_url, spotify_url, access_token, refresh_token`,
        [
          data.id,
          data.username,
          data.email,
          data.photo_url,
          data.spotify_url,
          data.access_token,
          data.refresh_token
        ]);

    return result.rows[0];
  }

  /** Find all users. */

  static async findAll() {
    const result = await db.query(
        `SELECT id, username, photo_url, access_token, refresh_token
          FROM users
          ORDER BY id`);

    return result.rows;
  }
  static async exists(id) {
    const userRes = await db.query(
      `SELECT id 
        FROM users
        WHERE id = $1`,
        [id]);

    if(userRes.rows.length === 0) {
      return false;
    }
    return true;
  }

  /** Given an id, return data about user. */

  static async findOne(id) {
    const userRes = await db.query(
        `SELECT id, username, photo_url, access_token, refresh_token
            FROM users 
            WHERE id = $1`,
        [id]);

    const user = userRes.rows[0];

    if (!user) {
      const error = new Error(`There exists no user with id: '${id}'`);
      error.status = 404;   // 404 NOT FOUND
      throw error;
    }

    //TODO: GET USER TRACKS/ARTISTS/GENRES
    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed user.
   *
   */

  static async update(id, data) {

    let {query, values} = partialUpdate(
        "users",
        data,
        "id",
        id
    );

    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      let notFound = new Error(`There exists no user with id: '${id}`);
      notFound.status = 404;
      throw notFound;
    }

    return result.rows[0];
  }

  /** Delete given user from database; returns undefined. */

  static async remove(id) {
      let result = await db.query(
              `DELETE FROM users 
                WHERE id = $1
                RETURNING id`,
              [id]);

    if (result.rows.length === 0) {
      let notFound = new Error(`There exists no user with id: '${id}'`);
      notFound.status = 404;
      throw notFound;
    }
  }
}


module.exports = User;
