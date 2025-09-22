const express = require('express');
var cors = require("cors");
const coursesRouter = require("./routes/corsi");
const lessonsRouter = require("./routes/lezioni");
const boatsRouter = require("./routes/imbarcazioni");
const documentsRouter = require("./routes/documenti");
const carnetRouter = require("./routes/carnet");

const app = express();

const port = 3000;
const contextPath = "/api";

app.use(cors({origin:"http://localhost:4200"}));
app.use(express.json());
app.use(express.urlencoded({extended: true,}));

app.use(contextPath + "/corsi", coursesRouter);
app.use(contextPath + "/lezioni", lessonsRouter);
app.use(contextPath + "/imbarcazioni", boatsRouter);
app.use(contextPath + "/documenti", documentsRouter);
app.use(contextPath + "/carnet/", carnetRouter);

app.all(contextPath + "/", (req, res) => {
    res.status(404);
    res.json({errorMsg: "Bella raga"});
});



app.listen(port, () => {
    console.log(`Backend in ascolto sulla porta ${port}`)
});