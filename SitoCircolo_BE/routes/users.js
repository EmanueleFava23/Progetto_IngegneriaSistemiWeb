const express = require("express");
const db = require("../db");
const usersDao = require("../DAO/usersDao");
const router = express.Router();


router.get("", async (req , res ) => {

    const filtri = req.query;
    let connection;

    try {
        connection = await db.getConnection();

        const results = await usersDao.mostraUtenti(connection, filtri);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/utenti.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release();
    }
});

router.post("",  async (req, res) => {
    const valori = req.body;
    let connection;
    try{
        connection = await db.getConnection();

        const results = await usersDao.aggiungiUtente(connection, valori);

        res.status(201);
        res.json(results);
    }
    catch (err){
        console.error("routes/utenti.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release(); 
    }
});


router.get("/:id", async (req, res) => {

    const id = req.params.id;
    let connection; 
    
    try{
        connection = await db.getConnection();

        const results = await usersDao.mostraUtentebyId(connection, id);
        
        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/utenti.js: ", err.message, err.stack);

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

        const [results] = await usersDao.eliminaUtente(connection, id);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/utenti.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release(); 
    }
});

router.patch("/:id", async (req, res) =>{
    const id = req.params.id;
    const valori = req.body;
    let connection;

    try{
        connection = await db.getConnection();

        const [results] = await usersDao.modificaUtente(connection, id, valori);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/utenti.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release(); 
    }
});


router.get("/:id/corsi", async (req, res) => {
    const id = req.params.id;
    let connection;

    try{
        connection = await db.getConnection();

        const results = await usersDao.mostraCorsiIscritto(connection, id);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/utenti.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release(); 
    }
});





module.exports = router;

