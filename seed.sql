DELETE FROM users;
DELETE FROM tracks;
DELETE FROM groups;
DELETE FROM user_groups;
DELETE FROM user_tracks;

-- users
INSERT INTO users(id,
    username, 
    email, 
    spotify_url,
    access_token, 
    refresh_token)
    VALUES ('1', 'test1', 'test1Email@test.com', 'www.test.com/1','1', '1'),
            ('2', 'test2', 'test2Email@test.com', 'www.test.com/2','2', '2'),
            ('3', 'test3', 'test3Email@test.com', 'www.test.com/3','3', '3'),
            ('4', 'test4', 'test4Email@test.com', 'www.test.com/4','4', '4'),
            ('5', 'test5', 'test5Email@test.com', 'www.test.com/5','5', '5')
;

-- tracks
INSERT INTO 
    tracks(id, track_name, image_url, spotify_url, artist_id, artist_name) 
VALUES 
    ('1', 'testtrack1', 'urlurl.com1', 'testspotifytrackaddr.com1', 'artist1', 'artistname1'),
    ('2', 'testtrack2', 'urlurl.com2', 'testspotifytrackaddr.com2', 'artist2', 'artistname2'),
    ('3', 'testtrack3', 'urlurl.com3', 'testspotifytrackaddr.com3', 'artist3', 'artistname3'),
    ('4', 'testtrack4', 'urlurl.com4', 'testspotifytrackaddr.com4', 'artist4', 'artistname4')
;

-- user tracks
INSERT INTO 
    user_tracks(user_id, track_id)
VALUES 
    ('1', '1'),
    ('1', '2'),
    ('1', '3'),
    ('2', '4'),
    ('2', '3'),
    ('4', '1')
;

-- groups
INSERT INTO 
    groups(id, group_name, info)
VALUES 
    (1, 'test', 'this is a test'),
    (2, 'test2', 'this is a test 2')
;


--user groups
INSERT INTO user_groups(user_id, group_id)
    VALUES ('1', 1), ('2', 1), ('3', 1), ('4', 1)
;
