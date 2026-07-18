const axios = require("axios");
const https = require("https");


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function sendWorker(data, token) {

    try {
        const response = await axios.post(

            `https://201.234.53.148:7555//api/v1/upload/jph`,

            data,

            {

                headers: {

                    Authorization:
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"

                },

                httpsAgent:
                    new https.Agent({
                        rejectUnauthorized: false
                    })

            }

        );

        // Esperar 1 segundo después del envío
        await sleep(1000);

        const payload = response.data;

        if (payload && typeof payload === "object" && payload.ok === false) {
            throw new Error(payload.error || payload.message || "La API devolvió un error");
        }

        return {
            ok: true,
            data: payload
        };
    } catch (error) {
        const upstreamMessage = error.response?.data
            ? (typeof error.response.data === "string"
                ? error.response.data
                : JSON.stringify(error.response.data))
            : error.message;

        throw new Error(`Error del servicio upstream: ${upstreamMessage}`);
    }

}


module.exports = {
    sendWorker
};