
require("dotenv").config();

const SECRET = process.env.SECRET_KEY || 'test';

const PORT = +process.env.PORT || 3001;

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "music-test";
} else {
  DB_URI  = process.env.DATABASE_URL || 'music';
}

console.log("Using database", DB_URI);

const SPOTIFY_CLIENT_ID = '5257e82daa794233911d5c03cd098989'; // Your client id
const SPOTIFY_SECRET = '6eab3af7111e495ea33d18b4a668172c'; // Your secret
const NUM_TOP_TRACKS = 5;
const NUM_TOP_ARTISTS = 5
const MAX_GROUP_SIZE = 9;

module.exports = {
  SECRET,
  PORT,
  DB_URI,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_SECRET,
  NUM_TOP_ARTISTS,
  NUM_TOP_TRACKS,
  MAX_GROUP_SIZE
};
