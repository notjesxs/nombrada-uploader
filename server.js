const express = require("express");
const path = require("path");

const app = express();


app.use(express.json());


app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


app.use(
    "/api/upload",
    require("./routes/upload")
);



app.listen(
    process.env.PORT || 3000,
    () => {
        console.log("Servidor iniciado");
    }
);