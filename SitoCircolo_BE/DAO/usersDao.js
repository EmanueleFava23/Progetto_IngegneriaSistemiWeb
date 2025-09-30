

const mostraUtenti = async (connection, filtri) => {
    
    let sql = 'SELECT * FROM UTENTE WHERE 1=1';

    Object.keys(filtri).forEach( (campo) => {
        sql += ` AND ${campo} = ?`;
    });

    const params = Object.values(filtri);

    const [rows] = await connection.query(sql, params);
    return rows; // Restituisci array di utenti
};



const mostraUtentebyId = async (connection, id) => {

    const sql = `SELECT u.*, 
                CASE 
                    WHEN c.id IS NOT NULL THEN 'CORSISTA'
                    WHEN i.id IS NOT NULL THEN 'ISTRUTTORE' 
                    WHEN s.id IS NOT NULL THEN 'SEGRETARIO'
                    ELSE NULL
                END as ruolo
                FROM UTENTE u
                LEFT OUTER JOIN CORSISTA as c ON u.id = c.id
                LEFT OUTER JOIN ISTRUTTORE as i ON u.id = i.id  
                LEFT OUTER JOIN SEGRETARIO as s ON u.id = s.id
                WHERE u.id = ?`;

    const params = [id];

    const [rows] = await connection.query(sql, params);
    return rows[0]; // Restituisci il primo utente o undefined se non trovato
};

const aggiungiUtente = async (connection, dati) =>{
    const datiNotNull = {};
    let ruolo = '';

    // Filtra i dati, escludendo 'id' e 'tipo'
    Object.keys(dati).forEach(campo => {
        if(dati[campo] !== undefined &&  dati[campo] !== null && dati[campo] !== ''){
            if(campo === 'ruolo'){
                ruolo = dati[campo];
            } else if(campo !== 'id') { // Escludi l'ID perché ora è AUTO_INCREMENT
                datiNotNull[campo] = dati[campo];
            }
        }
    });

    const campiNotNull = Object.keys(datiNotNull);
    const valori = Object.values(datiNotNull);
    const placeholders = campiNotNull.map(() => '?');

    await connection.beginTransaction();

    try{
        
        let sql = `INSERT INTO UTENTE (${campiNotNull.join(', ')}) VALUES (${placeholders.join(', ')})`;
        
        const [results1] = await connection.query(sql, valori);

        // Ottieni l'ID generato automaticamente
        const insertedId = results1.insertId;

        // Inserisci nella tabella specifica in base al ruolo
        switch (ruolo.toLowerCase()) {
            case 'corsista':
                sql = 'INSERT INTO CORSISTA (id) VALUES (?)';
                await connection.query(sql, [insertedId]);
                break;
            
            case 'istruttore':
                sql = 'INSERT INTO ISTRUTTORE (id) VALUES (?)';
                await connection.query(sql, [insertedId]);
                break;

            case 'segretario':
                sql = 'INSERT INTO SEGRETARIO (id) VALUES (?)';
                await connection.query(sql, [insertedId]);
                break;
        
            default:
                // Nessun tipo specificato, utente generico
                break;
        }

        await connection.commit();
        
        return {success: true, userId: insertedId};
    }
    catch(err){
        await connection.rollback();
        console.error('Operazione fallita:', err);
        throw err;
    }
};



const modificaUtente = async (connection,id,  dati) => {
    
    const campi = Object.keys(dati);
    const valori = Object.values(dati);

    const setClauses = campi.map(campo => `${campo} = ?`);
    const sql = `UPDATE UTENTE SET ${setClauses.join(', ')} WHERE id = ?`;
    
    const params = [...valori, id];
    
    const [result] = await connection.query(sql, params);
    return result;
};

const eliminaUtente = async(connection, id) => {
    const sql = "DELETE FROM UTENTE WHERE id = ?";

    const params = [id];

    const [result] = await connection.query(sql, params);
    return result;
}



const mostraCorsiIscritto = async (connection, corsistaId) => {
    const sql = `
        SELECT *
        FROM ISCRITTO_A as p JOIN CORSO as c ON p.corso_id = c.id
        WHERE corsista_id = ?
    `;

    const params = [corsistaId];

    const [rows] = await connection.query(sql, params);
    return rows; // Restituisci array di corsi
};

module.exports = {modificaUtente , aggiungiUtente, eliminaUtente, mostraUtentebyId, mostraUtenti, mostraCorsiIscritto};