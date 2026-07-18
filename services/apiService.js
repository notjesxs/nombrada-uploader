const axios = require("axios");
const https = require("https");


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function sendWorker(data, token) {


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


    // Esperar 5 segundos después del envío
    await sleep(5000);


    return response.data;

}


module.exports = {
    sendWorker
};