const express = require("express");
const auth = require("../middleware/auth");
const { authRequired } = require("../middleware/auth");
const router = express.Router();

const Group = require("../models/groups");
const UserGroup = require("../models/user_groups");
/** 
 * group ROUTES:
 *      -create new group
 *      -get all groups (that are not full)
 *      -get a specific group by id
 *      -search groups by group name
 *      -get groups with matching artists
*/
router.post("/new", authRequired, async function (req, res, next) {
    try {
        const data = req.body.data;
        let group = await Group.add(data);
        const res = await UserGroup.addUser(req.body.userId, group.id);
        group.num_users = 1;
        return res.json({ group });
    } catch (err) {
        return next(err);
    }
});

router.get("/", authRequired, async function (req, res, next) {
    try {
        const groups = await Group.findAll();
        return res.json({ groups });
    } catch (err) {
        return next(err);
    }
});

router.get("/:groupId", authRequired, async function (req, res, next) {
    try {
        const group = await Group.findOne(req.params.groupId)
        const users = await UserGroup.getUsers(req.params.groupId);
        group.users = users;
        return res.json({ group });
    } catch (err) {
        return next(err);
    }
});

router.post("/search", authRequired, async function (req, res, next) {
    try {
        const groups = await Group.search(req.body.search);
        return res.json({ groups })
    }
    catch (err) {
        return next(err);
    }
});
/** 
 * user_group ROUTES:
 *      -user joining groups
 *      -user leaving groups
 *      -get groups with matching tracks
 *      -get groups with matching artists
*/


router.post("/join/:groupId", authRequired, async function (req, res, next) {
    try {
        const result = UserGroup.addUser(req.body.userId, req.params.groupId);
        return res.json({msg: `User added to group: ${req.body.groupId}`})
    }
    catch (err) {
        return next(err);
    }
});

router.post("/leave/:groupId", authRequired, async function (req, res, next) {
    try {
        const result = UserGroup.removeUser(req.body.userId, req.params.groupId);
        if (res) {
            return res.send({ msg: "User removed from group" });
        }
        else {
            return res.send({ msg: `User not in group: ${req.body.groupId}` });
        }
    }
    catch (err) {
        return next(err);
    }
});

router.post("/search/tracks", authRequired, async function (req, res, next) {
    try {
        const groups = await UserGroup.match_groups_tracks(req.body.tracks)
        return res.json({ groups });
    } catch (err) {
        return next(err);
    }
});

router.post("/search/artists", authRequired, async function (req, res, next) {
    try {
        const groups = await UserGroup.match_groups_tracks(req.body.artists)
        return res.json({ groups });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;