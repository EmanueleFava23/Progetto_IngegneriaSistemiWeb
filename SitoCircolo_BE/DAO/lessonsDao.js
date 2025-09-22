
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

const eliminaLezioni = async (connection, corso) => {
    const sql = "DELETE FROM LEZIONE WHERE corso_id = ?";

    corso_id = Object.values(corso);

    return await connection.query(sql, corso_id);
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


module.exports = {mostraLezionebyId, mostraLezioni, eliminaLezioni, modificaLezione, creaLezione, eliminaLezione};