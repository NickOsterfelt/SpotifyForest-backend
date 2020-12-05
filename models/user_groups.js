const db = require("../db");
const Group = require("./groups");
class UserGroup {

    static async getByUser(userId) {
        const result = await db.query(
            `SELECT user_id, group_id
              FROM user_groups
              WHERE user_id = $1`,
            [userId]);

        return result.rows;
    }
    static async getUsers(groupId) {
        const result = await db.query(
            `SELECT users.id, users.username, users.photo_url, users.access_token, users.refresh_token
            FROM user_groups 
            RIGHT JOIN users
            ON user_groups.user_id = users.id
            WHERE (user_groups.group_id = ${groupId})
            `);
        return result.rows;
    }

    static async addUser(userId, groupId) {
        Group.increment_group_size(groupId);
        const result = await db.query(
            `INSERT INTO user_groups
            (user_id, group_id) 
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
            user_groups.group_id, groups.group_name, groups.num_users, 
            groups.info, ARRAY_AGG (user_tracks.track_id) tracks
            FROM 
                user_groups
            JOIN 
                user_tracks ON user_groups.user_id = user_tracks.user_id 
            JOIN 
                groups ON user_groups.group_id = groups.id 
            GROUP BY 
                user_groups.group_id, groups.group_name, groups.num_users, groups.info
            ORDER BY 
                user_groups.group_id`
        );
        //add [group_id, num_matched_tracks] tuple array to group_tracks
        console.log(res.rows);
        let groups = [];
        for (let group of res.rows) {
            let matchingTracks = new Set(group.tracks);
            let matchScore = 0;
            for (let track of user_tracks) {
                if (matchingTracks.has(track)) {

                    matchScore++;
                }
            }
            groups.push({
                groupId : group.group_id,
                groupName: group.group_name,
                numUsers: group.num_users,
                matchScore: matchScore,
                matchingTracks: matchingTracks,
                groupInfo : group.info
            });
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
        console.log(groups);
        return groups;
    }

    static async match_groups_artists(user_artists) {
        const res = await db.query(
            `SELECT 
                user_groups.group_id, groups.group_name, groups.num_users, 
                groups.info, ARRAY_AGG (user_artists.artist_id) artists
            FROM 
                user_groups
            JOIN 
                user_artists ON user_groups.user_id = user_artists.user_id 
            JOIN 
                groups ON user_groups.group_id = groups.id 
            GROUP BY 
                user_groups.group_id, groups.group_name, groups.num_users, groups.info
            ORDER BY 
                user_groups.group_id`
        );
        //add [group_id, num_matched_artists] tuple array to group_artists
        let groups = [];
        console.log(res.rows);
        for (let group of res.rows) {
            let matchingArtists = new Set(group.artists);
            let matchScore = 0;
            for (let track of user_artists) {
                if (matchingArtists.has(track)) {
                    matchScore++;
                }
            }
            groups.push({
                groupId : group.group_id,
                groupName: group.group_name,
                numUsers: group.numUsers,
                matchScore: matchScore,
                matchingArtists: matchingArtists,
                groupInfo : group.info
            });
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