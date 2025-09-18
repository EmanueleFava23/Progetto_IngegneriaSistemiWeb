const express = require('express');
var cors = require("cors");

const app = express();

const port = 3000;
const contextPath = "/api";

app.use(cors({origin:"http://localhost:4200"}));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.all("*", (req, res) => {
    res.status(404);
    res.json({errorMsg: "Risorsa non trovata"});
});



app.listen(port, () => {
    console.log(`Backend in ascolto sulla porta ${port}`)
});