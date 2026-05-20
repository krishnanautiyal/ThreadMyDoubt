const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.json(users);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;