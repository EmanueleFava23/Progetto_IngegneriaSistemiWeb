
const mostraLezioni = async (connection, filtri) => {

    let sql = 'SELECT * FROM LEZIONE WHERE 1=1';

    Object.keys(filtri).forEach( (campo) => {
        sql += ` AND ${campo} = ?`;
    });

    const params = Object.values(filtri);

    return await connection.query(sql, params);
};


const mostraLezionebyId = async (connection, id) => {
    const sql = "SELECT * FROM LEZIONE WHERE id = ?";

    params = [id];

    return await connection.query(sql, params);
};

const eliminaLezione = async (connection, id) => {
    const sql = "DELETE FROM LEZIONE WHERE id = ?";

    params = [id];

    return await connection.query(sql, params);
};


const modificaLezione = async (connection, id, valori) => {
    const campi = Object.keys(valori);
    const valoriArray = Object.values(valori);
    
    const setClauses = campi.map(campo => `${campo} = ?`);
    const sql = `UPDATE LEZIONE SET ${setClauses.join(', ')} WHERE id = ?`;
    
    const params = [...valoriArray, id];
    
    return await connection.query(sql, params);
};

const creaLezione = async (connection, dati) => {

    const datiNotNull = {};

    Object.keys(dati).forEach(campo => {
        if(dati[campo] !== undefined && dati[campo] !== null && dati[campo] !== ''){
            datiNotNull[campo] = dati[campo];
        }
    });

    const campiNotNull = Object.keys(datiNotNull);
    const valori = Object.values(datiNotNull);
    const placeholders = campiNotNull.map(() => '?');

    const sql = `INSERT INTO LEZIONE (${campiNotNull.join(`, `)}) VALUES (${placeholders.join(', ')})`;

    return await connection.query(sql, valori);
};

const prenotaLezione = async (connection, dati) => {



    sql = `INSERT INTO PARTECIPA_A (corsista_id, lezione_id) VALUES (?, ?)`;
    const params = [dati.userId, dati.lezione_id];

    return await connection.query(sql, params);
};

const mostraPrenotazione = async (connection, lezione_id, corsista_id) => {
    let sql = `SELECT * FROM PARTECIPA_A 
               WHERE lezione_id = ? AND corsista_id = ?`;
    const params = [lezione_id, corsista_id];
    
    return await connection.query(sql, params);
}



module.exports = {mostraLezionebyId, mostraLezioni, modificaLezione, creaLezione, eliminaLezione, prenotaLezione, mostraPrenotazione};