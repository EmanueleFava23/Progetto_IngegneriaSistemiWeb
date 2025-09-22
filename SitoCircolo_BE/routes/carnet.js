const express = require("express");
const lessonsDao = require("../DAO/carnetDao");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {

    const filtri = req.query;

    try {
        const connection = await db.getConnection();

        const [results] = await lessonsDao.mostraCarnet(connection, filtri);

        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/carnet.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.end();
    }
});

router.get("/:id",async (req, res) => {
    const id = req.params.id;

    try{
        const connection = await db.getConnection();

        const [results] = await lessonsDao.mostraCarnetbyId(connection, id);

        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/carnet.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.end();
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try{
        const connection = await db.getConnection();

        const [results] = await lessonsDao.eliminaCarnet(connection, id);

        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/carnet.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.end(); 
    }
});

router.patch("/:id", async (req, res) =>{
    const id = req.params.id;

    const valori = req.body;

    try{
        const connection = await db.getConnection();

        const [results] = await lessonsDao.modificaCarnet(connection, id, valori);

        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/carnet.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.end(); 
    }
});

router.post("/new", async (req, res) => {
    const valori = req.body;

    try{
        const connection = await db.getConnection();

        const [results] = await lessonsDao.creaCarnet(connection, valori);

        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/carnet.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.end(); 
    }
});

module.exports = router;