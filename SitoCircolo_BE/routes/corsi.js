const express = require("express");
const coursesDao = require("../DAO/coursesDao");
const db = require("../db");


const router = express.Router();


//PER VEDERE TUTTI I CORSI (CON PARAMETRI)
router.get("", async (req, res) => {

    const filtri = req.query;
    let connection;

    try {
        connection = await db.getConnection();


        const [results] = await coursesDao.mostraCorsi(connection, filtri);

        res.status(200);
        res.json(results);
    } catch (err){
        console.error("routes/corsi.js: ", err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release();
    }
});

//CREARE UN CORSO
router.post("", async (req, res) => {
    const valori = req.body;
    let connection;

    try{
        connection = await db.getConnection();

        const [results] = await coursesDao.creaCorso(connection, valori);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/corsi.js" , err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release();
    }
});


//PER VEDERE UN SINGOLO CORSO
router.get("/:id", async (req, res) => {

    const id = req.params.id;
    let connection;
    try{
        connection = await db.getConnection();

        const [results] = await coursesDao.mostraCorsobyId(connection, id);

        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/corsi.js" , err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release();
    }
})

//ELIMINARE UN CORSO
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    let connection;
    try{
        connection = await db.getConnection();

        const [results] = await coursesDao.eliminaCorso(connection, id);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/corsi.js" , err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release();
    }
})

//MODIFICA CORSO
router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const valori = req.body;
    let connection;

    try{
        connection = await db.getConnection();
        
        const [results] = await coursesDao.modificaCorso(connection, id, valori);

        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/corsi.js" , err.message, err.stack);

        res.status(400);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release();
    }
});

router.get("/:id/iscritti", async (req, res) => {
    const id = req.params.id;
    let connection;

    try{
        connection = await db.getConnection();

        const [results] = await coursesDao.mostraIscrittiCorso(connection, id);


        res.status(200);
        res.json(results);
    }
    catch (err){
        console.error("routes/corsi.js" , err.message, err.stack);

        res.status(500);
        res.json({errorMsg: err.message});
    } finally {
        if (connection) await connection.release();
    }
});

router.post("/:id/iscritti", async (req, res) => {
    const corsoId = req.params.id;
    const corsista_id = req.body.corsista_id;
    console.log(req.headers);
    let connection;

    try{
        connection = await db.getConnection();
        console.log(corsoId, corsista_id);
        const [results] = await coursesDao.iscriviUtenteAlCorso(connection, corsoId, corsista_id);

        res.status(200);
        res.json(results);
    }
    catch (err){
        if(err.code === 'ER_DUP_ENTRY'){
            res.status(409).json({ errorMsg: 'Utente già iscritto a questo corso' });
            console.error("già iscritto");
        } else {
            res.status(500).json({ errorMsg: 'Errore generico' });
            console.error("ritorno questo");
        }

    } finally {
        if (connection) await connection.release();
    }
});










module.exports = router;