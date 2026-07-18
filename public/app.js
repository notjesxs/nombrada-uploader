const btn = document.getElementById("btnEnviar");
const excel = document.getElementById("excel");
const estado = document.getElementById("estado");
const tabla = document.getElementById("tabla");
const barra = document.getElementById("barra");
const btnLogs = document.getElementById("btnLogs");
const listaLogs = document.getElementById("listaLogs");
const logContent = document.getElementById("logContent");

function renderLogList(logs) {
    listaLogs.innerHTML = "";

    if (!logs.length) {
        listaLogs.innerHTML = "<p>No hay logs aún.</p>";
        return;
    }

    logs.forEach(log => {
        const item = document.createElement("div");
        item.className = "log-item";
        item.innerHTML = `
            <strong>${log.name}</strong><br>
            <small>${new Date(log.modifiedAt).toLocaleString("es-PE")}</small>
        `;

        item.onclick = async () => {
            document.querySelectorAll(".log-item").forEach(el => el.classList.remove("active"));
            item.classList.add("active");
            logContent.textContent = "Cargando...";

            try {
                const response = await fetch(`/api/logs/${log.name}`);
                const data = await response.json();

                if (!data.ok) {
                    throw new Error(data.message || "No se pudo cargar el log");
                }

                logContent.textContent = JSON.stringify(data.log, null, 2);
            } catch (error) {
                logContent.textContent = `Error: ${error.message}`;
            }
        };

        listaLogs.appendChild(item);
    });
}

btnLogs.onclick = async () => {
    try {
        const response = await fetch("/api/logs");
        const data = await response.json();

        if (!data.ok) {
            throw new Error(data.error || "No se pudieron cargar los logs");
        }

        renderLogList(data.logs);
    } catch (error) {
        listaLogs.innerHTML = `<p>Error: ${error.message}</p>`;
    }
};



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