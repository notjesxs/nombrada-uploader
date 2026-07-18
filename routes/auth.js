const express = require("express");
const router = express.Router();

const { getToken } = require("../services/tokenService");

router.get("/", async (req, res) => {

    try {

        const token = await getToken();

        res.json({
            ok: true,
            token
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            error: error.message
        });

    }

});

module.exports = router;