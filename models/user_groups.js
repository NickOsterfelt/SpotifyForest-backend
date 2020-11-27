const db = require("../db");
const Group = require("./groups");
class UserGroup {

    static async getByUser(userId) {
        const result = await db.query(
            `SELECT user_id, artist_id,
              FROM user_artists
              WHERE user_id = $1`,
            [userId]);

        return result.rows;
    }

    static async addUser(userId, groupId) {
        Group.increment_group_size(groupId);
        const result = await db.query(
            `INSERT INTO user_groups
            (user_id, artist_id) 
            VALUES ($1, $2) 
            RETURNING user_id, group_id`,
            [userId, groupId]
        );
        return result.rows[0];
    }

    static async removeUser(userId, groupId) {
        const size = Group.decrement_group_size(groupId);
        if (size === 0) {
            Group.remove(groupId);
        }
        else {
            const result = await db.query(
                `DELETE FROM user_groups 
                WHERE user_id = $1 
                AND group_id = $2
                RETURNING id`,
                [userId, groupId]
            );
            return result.rows[0];
        }
    }

    static async match_groups_tracks(user_tracks) {
        const res = await db.query(
            `SELECT 
                group_id, ARRAY_AGG (user_tracks.track_id) tracks
            FROM 
                user_groups
            JOIN 
                user_tracks ON user_groups.user_id = user_tracks.user_id 
            GROUP BY 
                user_groups.group_id 
            ORDER BY 
                user_groups.group_id`
        );
        //add [group_id, num_matched_tracks] tuple array to group_tracks
        let groups = [];
        for(group of res.rows) {
            let matchingTracks = Set(group.tracks);
            let matchScore = 0;
            for (track of user_tracks){
                if(matchingTracks.has(track)){
                    matchScore++;
                }
            }
            groups.push([group.id, matchScore, matchingTracks])
        }
        //sort groups by score in reverse order to get highest match score
        groups.sort(function (a, b) {
            if (a[0] === b[0]) {
                return 0;
            }
            else {
                return (a[0] > b[0]) ? -1 : 1;
            }
        });

        return groups;
    }

    static async match_groups_artists(user_artists) {
        const res = await db.query(
            `SELECT 
                group_id, ARRAY_AGG (user_artists.track_id) artists
            FROM 
                user_groups
            JOIN 
                user_artists ON user_artists.user_id = user_artists.user_id 
            GROUP BY 
                user_groups.group_id 
            ORDER BY 
                user_groups.group_id`
        );
        //add [group_id, num_matched_artists] tuple array to group_artists
        let groups = [];
        for(group of res.rows) {
            let matchingArtists = Set(group.artists);
            let matchScore = 0;
            for (track of user_artists){
                if(matchingArtists.has(track)){
                    matchScore++;
                }
            }
            groups.push([group.id, matchScore, matchingArtists])
        }
        //sort groups by score in reverse order to get highest match score
        groups.sort(function (a, b) {
            if (a[0] === b[0]) {
                return 0;
            }
            else {
                return (a[0] > b[0]) ? -1 : 1;
            }
        });

        return groups;
    }
}

module.exports = UserGroup;