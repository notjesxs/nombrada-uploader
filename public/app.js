const btn = document.getElementById("btnEnviar");

const excel = document.getElementById("excel");

const estado = document.getElementById("estado");

const tabla = document.getElementById("tabla");

const barra = document.getElementById("barra");



btn.onclick = async () => {


    if (!excel.files.length) {

        alert("Seleccione un Excel");

        return;

    }


    const form = new FormData();


    form.append(
        "excel",
        excel.files[0]
    );



    estado.innerHTML =
        "Procesando...";


    tabla.innerHTML = "";

    barra.style.width = "0%";



    try {


        const response =
            await fetch(
                "/api/upload",
                {

                    method: "POST",

                    body: form

                }
            );


        const data =
            await response.json();



        estado.innerHTML =
            `
        Total:
        ${data.totalExcel}
        <br>
        Enviados:
        ${data.enviados}
        <br>
        Errores:
        ${data.errores}
        `;



        barra.style.width = "100%";



        data.resultados.forEach(item => {


            const tr =
                document.createElement("tr");


            tr.innerHTML =
                `

            <td>
            ${item.documento}
            </td>

            <td>
            ${item.nombre}
            </td>


            <td>
            ${item.ok
                    ?
                    "✅ OK"
                    :
                    "❌ ERROR"
                }
            </td>

            `;


            tabla.appendChild(tr);


        });



    }
    catch (error) {

        estado.innerHTML =
            "Error: " + error.message;

    }


};