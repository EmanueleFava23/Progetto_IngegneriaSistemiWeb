const express = require("express");
const coursesDao = require("../DAO/coursesDao");
const db = require("../db");


const router = express.Router();


//PER VEDERE TUTTI I CORSI (CON PARAMETRI)
router.get("/", async (req, res) => {

    const filtri = req.query;

    try {
        const connection = await db.getConnection();


        const [results] = await coursesDao.mostraCorsi(connection, filtri);

        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(results);
    } catch (err){
        console.error("routes/corsi.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    }
});


//PER VEDERE UN SINGOLO CORSO
router.get("/:id", async (req, res) => {

    const id = req.params.id;
    try{
        const connection = await db.getConnection();

        const [results] = await coursesDao.mostraCorsobyId(connection, id);

        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/corsi.js" , err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    }
})

//ELIMINARE UN CORSO
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try{
        const connection = await db.getConnection();

        const [results] = await coursesDao.eliminaCorso(connection, id);

        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/corsi.js" , err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    }
})

//MODIFICA CORSO
router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const valori = req.body;

    try{
        const connection = await db.getConnection();
        
        const [results] = await coursesDao.modificaCorso(connection, id, valori);

        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/corsi.js" , err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    }
});

//CREARE UN CORSO
router.post("/nuovo", async (req, res) => {
    const valori = req.body;

    try{
        const connection = await db.getConnection();

        const [results] = await coursesDao.creaCorso(connection, valori);

        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/corsi.js" , err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    }
});








module.exports = router;