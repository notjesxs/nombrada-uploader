const XLSX = require("xlsx");


function readExcel(filePath) {

    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];


    const rows = XLSX.utils.sheet_to_json(sheet, {
        defval: ""
    });


    return rows.map((row, index) => {

        return {

            fila: index + 2,

            fechaConvocatoria: String(
                row["FECHA CONVOCATORIA"]
            ).trim(),

            documento: String(
                row["DOCUMENTO"]
            ).trim(),

            nombre: String(
                row["NOMBRE"]
            ).trim(),

            habilidad: String(
                row["HABILIDAD"]
            ).trim(),

            turno: String(
                row["TURNO"]
            ).trim().toUpperCase(),

            estado: String(
                row["ESTADO"]
            ).trim().toUpperCase()

        };

    });

}


module.exports = {
    readExcel
};