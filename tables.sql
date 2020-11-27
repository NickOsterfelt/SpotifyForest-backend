CREATE TABLE users(
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    photo_url TEXT,
    spotify_url TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL
);

CREATE TABLE groups(
    id SERIAL PRIMARY KEY,
    group_name TEXT NOT NULL,
    num_users INTEGER CONSTRAINT max_users CHECK(num_users <= 10 AND num_users >= 0),
    is_full BOOLEAN NOT NULL DEFAULT FALSE,
    friend_group BOOLEAN NOT NULL DEFAULT FALSE,
    info TEXT
);

CREATE TABLE user_groups(
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE
);

CREATE TABLE artists(
    id TEXT PRIMARY KEY,
    artist_name TEXT NOT NULL,
    spotify_url TEXT,
    image_url TEXT
);

CREATE TABLE tracks(
    id TEXT PRIMARY KEY,
    track_name TEXT NOT NULL,
    image_url TEXT,
    spotify_url TEXT UNIQUE,
    artist_id TEXT,
    artist_name TEXT
);

CREATE TABLE artist_tracks(
    id SERIAL PRIMARY KEY,
    artist_id TEXT REFERENCES artists (id) ON DELETE CASCADE UNIQUE, 
    track_id TEXT REFERENCES tracks (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_artists(
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users (id) ON DELETE CASCADE,
    artist_id TEXT REFERENCES artists (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_tracks(
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users (id) ON DELETE CASCADE, 
    track_id TEXT REFERENCES tracks (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



