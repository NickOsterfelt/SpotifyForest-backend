const db = require("../db");

class Group {

    static async add(data) {
        if (data.friend_group)
            const res = await db.query(
                `INSERT INTO groups 
                (group_name, num_users, friend_group, info) 
              VALUES ($1, $2, $3, $4) 
              RETURNING group_name, num_users, friend_group, info`,
                [
                    data.group_name,
                    data.num_users,
                    data.image_url,
                    data.friend_group,
                    data.info
                ]);

        return res.rows[0];
    }

    static async findAll() {
        const res = await db.query(
            `SELECT group_name, num_users, is_full, friend_group, info
              FROM groups
              ORDER BY group_`
        );

        return res.rows;
    }

    static async findOne(id) {
        const res = await db.query(
            `SELECT group_name, num_users, is_full, friend_group, info
                FROM groups 
                WHERE id = $1`,
            [id]);

        const group = res.rows[0];

        if (!group) {
            const error = new Error(`There exists no artist with id: '${id}'`);
            error.status = 404;   // 404 NOT FOUND
            throw error;
        }

        return group;
    }

    static async exists(id) {
        const res = await db.query(
            `SELECT id 
            FROM groups
            WHERE id = $1`,
            [id]);

        if (res.rows.length === 0) {
            return false;
        }
        return true;
    }

    static async search(group_name) {
        const res = await db.query(
            `SELECT group_name, num_users, is_full, friend_group, info
            FROM tracks
            WHERE friend_group = false
            AND group_name ILIKE $1`,
            [group_name]);

        return res.rows;
    }

    static async increment_group_size(id) {
        try {
            const res = await db.query(
                `UPDATE groups
                SET num_users = num_users + 1
                WHERE id = $1
                RETURNING id`,
                [id]
            );
            return res.rows[0]
        }
        catch (e){
            if(e.code === 23514) {
                let badRequest = new Error(`Group with id: ${id}, is full`);
                badRequest.status = 400;
                throw badRequest;
            }
            else throw e;
        }

    }

    static async decrement_group_size(id) {
        try {
            let res = await db.query(
                `UPDATE groups
                SET num_users = num_users - 1
                WHERE id = $1
                RETURNING num_users`,
                [id]
            );
            if(res.rows.num_users === 0){
                res = await this.remove(id);
                return res;
            }
            return res.rows[0];
        }
        catch (e){
            if(e.code === 23514) {
                let badRequest = new Error(`Group with id: ${id}, is already empty`);
                badRequest.status = 400;
                throw badRequest;
            }
            else throw e;
        }
    }

    static async update(id, data) {
        let { query, values } = partialUpdate(
            "groups",
            data,
            "id",
            id
        );

        const result = await db.query(query, values);
        const group = result.rows[0];

        if (!group) {
            let notFound = new Error(`There exists no group with id: '${id}`);
            notFound.status = 404;
            throw notFound;
        }

        return result.rows[0];
    }

    static async remove(id) {
        const res = await db.query(
            `DELETE FROM groups,
            WHERE id = $1
            RETURNING id`,
            [id]
        );
        const group = res.rows[0];
        if (!group) {
            let notFound = new Error(`There exists no group with id: '${id}`);
            notFound.status = 404;
            throw notFound;
        }
        return "Group deleted";
    }

}

module.exports = Group;