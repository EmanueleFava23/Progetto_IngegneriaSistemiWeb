const express = require("express");
const documentsDao = require("../DAO/documentsDao");
const db = require("../db");

const router = express.Router();


router.get("", async (req, res) => {

    const filtri = req.query;
    let connection;

    try {
        connection = await db.getConnection();

        const [results] = await documentsDao.mostraDocumenti(connection, filtri);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/documenti.js: ", err.message, err.stack);

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

        const [results] = await documentsDao.creaDocumento(connection, valori);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/documenti.js: ", err.message, err.stack);

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

        const [results] = await documentsDao.mostraDocumentobyId(connection, id);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/documenti.js: ", err.message, err.stack);

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

        const [results] = await documentsDao.eliminaDocumento(connection, id);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/documenti.js: ", err.message, err.stack);

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

        const [results] = await documentsDao.modificaDocumento(connection, id, valori);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/documenti.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release(); 
    }
});


module.exports = router;