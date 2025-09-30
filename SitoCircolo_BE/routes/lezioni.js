const express = require("express");
const lessonsDao = require("../DAO/lessonsDao");
const db = require("../db");


const router = express.Router();

router.get("", async (req, res) => {
    const filtri = req.query;
    let connection;

    try {
        connection = await db.getConnection();

        const [results] = await lessonsDao.mostraLezioni(connection, filtri);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/lezioni.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release();
    }
});

router.post("", async (req, res) => {
    const valori = req.body;
    let connection;

    try{
        connection = await db.getConnection();

        const [results] = await lessonsDao.creaLezione(connection, valori);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/lezioni.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release(); 
    }
});

router.get("/:id",async (req, res) => {
    const id = req.params.id;
    let connection;

    try{
        connection = await db.getConnection();

        const [results] = await lessonsDao.mostraLezionebyId(connection, id);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/lezioni.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release();
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    let connection;

    try{
        connection = await db.getConnection();

        const [results] = await lessonsDao.eliminaLezione(connection, id);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/lezioni.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release(); 
    }
});


router.patch("/:id", async (req, res) =>{
    const id = req.params.id;
    let connection;

    const valori = req.body;

    try{
        connection = await db.getConnection();

        const [results] = await lessonsDao.modificaLezione(connection, id, valori);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/lezioni.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release(); 
    }
});

router.post("/:id/prenotazione", async (req, res) => {
    const dati = req.body;
    const id = req.params.id;
    let connection;
    
    try{
        connection = await db.getConnection();

        dati.lezione_id = id;

        const [results] = await lessonsDao.prenotaLezione(connection, dati);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/lezioni.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release(); 
    }
});

router.get("/:id/prenotazione", async (req, res) => {
    const lezione_id = req.params.id;
    const corsista_id = req.query.corsista_id;
    let connection;

    try {
        connection = await db.getConnection();

        const [results] = await lessonsDao.mostraPrenotazione(connection, lezione_id, corsista_id);

        res.status(200);
        res.json(results);
    }
    catch (err) {
        console.error("routes/lezioni.js: ", err.message, err.stack);

        res.status(400);
        res.json({ errorMsg: err.message });
    } finally {
        if (connection) await connection.release();
    }
});

module.exports = router;
