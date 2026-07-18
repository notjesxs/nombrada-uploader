const fs = require("fs");
const path = require("path");
const axios = require("axios");
const https = require("https");

const TOKEN_FILE = path.join(__dirname, "..", "token.json");

async function login() {
    const response = await axios.post(
        `${process.env.API_URL}/api/v1/login`,
        {},
        {
            auth: {
                username: process.env.API_USER,
                password: process.env.API_PASSWORD
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    const token = response.data.token;

    const now = Date.now();

    const data = {
        token,
        createdAt: now,
        expiresAt: now + (60 * 60 * 1000)
    };

    fs.writeFileSync(TOKEN_FILE, JSON.stringify(data, null, 4));

    return token;
}

async function getToken() {

    if (!fs.existsSync(TOKEN_FILE)) {
        return await login();
    }

    const data = JSON.parse(fs.readFileSync(TOKEN_FILE));

    if (!data.token) {
        return await login();
    }

    if (Date.now() >= data.expiresAt) {
        return await login();
    }

    return data.token;
}

module.exports = {
    getToken
};