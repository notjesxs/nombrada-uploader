const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

function generarHorario(turno, fecha) {

    const fechaBase = dayjs(
        fecha,
        "DD/MM/YYYY"
    );


    switch (turno) {


        case "MAÑANA":

            return {
                horario: "M",

                fechaInicioUTC:
                    fechaBase.format("YYYY-MM-DD")
                    + "T06:00:00Z",

                fechaFinUTC:
                    fechaBase.format("YYYY-MM-DD")
                    + "T16:30:00Z"
            };


        case "TARDE":

            return {
                horario: "T",

                fechaInicioUTC:
                    fechaBase.format("YYYY-MM-DD")
                    + "T15:00:00Z",

                fechaFinUTC:
                    fechaBase
                        .add(1, "day")
                        .format("YYYY-MM-DD")
                    + "T00:30:00Z"
            };


        case "NOCHE":

            return {

                horario: "N",

                fechaInicioUTC:
                    fechaBase
                        .subtract(1, "day")
                        .format("YYYY-MM-DD")
                    + "T22:30:00Z",


                fechaFinUTC:
                    fechaBase.format("YYYY-MM-DD")
                    + "T08:30:00Z"

            };


        default:

            throw new Error(
                `Turno inválido ${turno}`
            );
    }

}



function mapWorker(worker, token) {


    const horario = generarHorario(
        worker.turno,
        worker.fechaConvocatoria
    );


    return {

        token: token,

        codigoTarea: [

            {

                codigoTarea:
                    "PRU02026110726",


                fechaInicioUTC:
                    horario.fechaInicioUTC,


                fechaFinUTC:
                    horario.fechaFinUTC,


                horario:
                    horario.horario,


                habilidad:
                    "PRUEBA",


                maquinaria: "PRUEBA",


                idEmpleado:
                    worker.documento

            }

        ]

    };

}


module.exports = {
    mapWorker
};