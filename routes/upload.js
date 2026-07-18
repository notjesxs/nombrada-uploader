const express = require("express");
const multer = require("multer");

const fs = require("fs");
const path = require("path");

const router = express.Router();

const { readExcel } = require("../services/excelService");
const { getToken } = require("../services/tokenService");
const { mapWorker } = require("../services/mapperService");
const { sendWorker } = require("../services/apiService");

const resultados = [];
const inicioProceso = new Date();

const upload = multer({
    dest: "uploads/"
});


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Convertir fecha a hora de Perú (UTC-5)
function convertToPET(date) {
    const adjustedDate = new Date(date.getTime() - (5 * 60 * 60 * 1000));
    return adjustedDate.toISOString().replace('Z', ' PET');
}


router.post("/", upload.single("excel"), async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                ok: false,

                message: "No se recibió archivo Excel"

            });

        }


        // Leer Excel

        const workers = readExcel(
            req.file.path
        );


        // Solo CONFIRMADOS

        const confirmed = workers.filter(worker =>
            worker.estado === "CONFIRMADO"
        );


        console.log(
            `Total Excel: ${workers.length}`
        );


        console.log(
            `Total confirmados: ${confirmed.length}`
        );


        /*
            Obtenemos el token una sola vez
        */

        const token = await getToken();


        const resultados = [];

        let contador = 0;



        for (const worker of confirmed) {


            contador++;


            console.log(
                `Enviando ${contador}/${confirmed.length}: ${worker.documento}`
            );


            try {


                // Convertir al formato API

                const body = mapWorker(
                    worker,
                    token
                );


                console.log(
                    JSON.stringify(body, null, 4)
                );


                // Enviar API

                const response = await sendWorker(
                    body,
                    token
                );


                resultados.push({

                    documento:
                        worker.documento,

                    nombre:
                        worker.nombre,

                    ok:
                        response.ok,

                    respuesta:
                        response.data ?? response

                });



                console.log(
                    `OK: ${worker.documento}`
                );



            } catch (error) {


                console.error(
                    `ERROR ${worker.documento}`,
                    error.message
                );


                resultados.push({

                    documento:
                        worker.documento,

                    nombre:
                        worker.nombre,

                    ok: false,

                    error:
                        error.message

                });


            }



            // Espera de 5 segundos antes del siguiente

            if (contador < confirmed.length) {

                console.log(
                    "Esperando 5 segundos..."
                );

                await sleep(5000);

            }


        }

        const logData = {

            fechaInicio: convertToPET(inicioProceso),

            fechaFin: convertToPET(new Date()),

            totalExcel: workers.length,

            totalConfirmados: confirmed.length,

            enviados: resultados.filter(
                item => item.ok === true
            ).length,

            errores: resultados.filter(
                item => item.ok === false
            ).length,

            resultados

        };


        const nombreArchivo =
            `envio-${Date.now()}.json`;


        const rutaLog = path.join(
            __dirname,
            "..",
            "logs",
            nombreArchivo
        );


        fs.writeFileSync(
            rutaLog,
            JSON.stringify(
                logData,
                null,
                4
            )
        );


        console.log(
            `Log generado: ${rutaLog}`
        );

        res.json({

            ok: true,

            totalExcel:
                workers.length,

            totalConfirmados:
                confirmed.length,

            enviados:
                resultados.filter(
                    item => item.ok === true
                ).length,


            errores:
                resultados.filter(
                    item => item.ok === false
                ).length,


            resultados

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