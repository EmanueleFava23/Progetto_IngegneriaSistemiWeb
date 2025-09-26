const mostraCorsi = async (connection, filtri) => {

    let sql = 'SELECT * FROM CORSO WHERE 1=1';
    const params = [];

    if (filtri.nome){
        sql += ' AND nome LIKE ?';
        params.push(`%${filtri.nome}%`);
    }
    if (filtri.livello){
        sql += ' AND livello = ?';
        params.push(filtri.livello);
    }
    if (filtri.data_inizio){
        sql += ' AND data_inizio >= ?';
        params.push(filtri.data_inizio);
    }
    if (filtri.data_fine){
        sql += ' AND data_fine <= ?';
        params.push(filtri.data_fine);
    }
    if (filtri.max_partecipanti){
        sql += ' AND max_partecipanti <= ?';
        params.push(filtri.max_partecipanti);
    }

    return await connection.query(sql, params);
}

const mostraCorsobyId = async (connection, id) => {

    const sql = 'SELECT * FROM CORSO WHERE id = ?';

    const params = [id];

    return await connection.query(sql, params);
}

const creaCorso = async (connection, dati) => {
    
    const valoriNotNull = {};
    
    Object.keys(dati).forEach(key => {
        if (dati[key] !== undefined && dati[key] !== null && dati[key] !== '') {
            valoriNotNull[key] = dati[key];
        }
    });

    const campi = Object.keys(valoriNotNull);           //attributi
    const placeholders = campi.map(() => '?');          //array di "?"
    const valori = Object.values(valoriNotNull);        //valore degli attributi

    const sql = `INSERT INTO CORSO (${campi.join(', ')}) VALUES (${placeholders.join(', ')})`;
    
    return await connection.query(sql, valori);
};

const eliminaCorso = async (connection, id) => {

    const sql = `DELETE FROM CORSO WHERE id = ?`;

    const params = [id];

    return await connection.query(sql, params);
}

const modificaCorso = async (connection, id, valori) => {
    const campi = Object.keys(valori);
    const valoriArray = Object.values(valori);
    
    // Costruisci array di "campo = ?" e poi uniscili con join
    const CampiCompleti = campi.map(campo => `${campo} = ?`);
    const sql = `UPDATE CORSO SET ${CampiCompleti.join(', ')} WHERE id = ?`;

    // Aggiungi l'id alla fine dei parametri
    const params = [...valoriArray, id];
    
    return await connection.query(sql, params);
};

const mostraIscrittiCorso = async (connection, corsoId) => {
    const sql = `
        SELECT U.*
        FROM UTENTE as U
        JOIN ISCRITTO_A as I ON U.id = I.corsista_id
        WHERE I.corso_id = ?
    `;

    const params = [corsoId];

    return await connection.query(sql, params);
};

const iscriviUtenteAlCorso = async (connection, corsoId, utenteId) => {
    const sql = `
        INSERT INTO ISCRITTO_A (corsista_id, corso_id)
        VALUES (?, ?)
    `;

    const params = [utenteId, corsoId];

    return await connection.query(sql, params);
};

module.exports = {mostraCorsi, mostraCorsobyId, creaCorso, eliminaCorso, modificaCorso, mostraIscrittiCorso, iscriviUtenteAlCorso };