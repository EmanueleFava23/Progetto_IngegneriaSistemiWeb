const express = require("express");
const lessonsDao = require("../DAO/carnetDao");
const db = require("../db");

const router = express.Router();

router.get("", async (req, res) => {
    const filtri = req.query;
    let connection;

    try {
        connection = await db.getConnection();

        const [results] = await lessonsDao.mostraCarnet(connection, filtri);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/carnet.js: ", err.message, err.stack);

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

        const [results] = await lessonsDao.creaCarnet(connection, valori);

        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/carnet.js: ", err.message, err.stack);

        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409);
            res.json({errorMsg: 'Carnet già esistente: impossibile creare un duplicato.'});
        } else if (err.code === 'ER_BAD_NULL_ERROR') {
            
            res.status(400);
            res.json({errorMsg: 'Campo obbligatorio mancante. Verificare i dati inseriti.'});
        } else {
            
            res.status(500);
            res.json({errorMsg: 'Errore interno del server durante la creazione del carnet.'});
        }
    } finally {
        if (connection) await connection.release(); 
    }
});

router.get("/:id",async (req, res) => {
    const id = req.params.id;
    let connection;

    try{
        connection = await db.getConnection();

        const [results] = await lessonsDao.mostraCarnetbyId(connection, id);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/carnet.js: ", err.message, err.stack);

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

        const [results] = await lessonsDao.eliminaCarnet(connection, id);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/carnet.js: ", err.message, err.stack);

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

        const [results] = await lessonsDao.modificaCarnet(connection, id, valori);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/carnet.js: ", err.message, err.stack);

        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409);
            res.json({errorMsg: 'Conflitto: il valore modificato crea un duplicato.'});
        } else if (err.code === 'ER_BAD_NULL_ERROR') {
            res.status(400);
            res.json({errorMsg: 'Campo obbligatorio mancante. Verificare i dati inseriti.'});
        } else {
            res.status(500);
            res.json({errorMsg: 'Errore interno del server durante la modifica del carnet.'});
        }
    } finally {
        if (connection) await connection.release(); 
    }
});



module.exports = router;