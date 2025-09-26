
const mostraDocumenti = async (connection, filtri) => {

    let sql = 'SELECT * FROM DOCUMENTO WHERE 1=1';

    Object.keys(filtri).forEach( (campo) => {
        sql += ` AND ${campo} = ?`;
    });

    const params = Object.values(filtri);

    return await connection.query(sql, params);
};

const mostraDocumentobyId = async (connection, id) => {
    const sql = "SELECT * FROM DOCUMENTO WHERE id = ?";

    const params = [id];

    return await connection.query(sql, params);
};

const eliminaDocumento = async (connection, id) => {
    const sql = "DELETE FROM DOCUMENTO WHERE id = ?";

    const params = [id];

    return await connection.query(sql, params);
};

const modificaDocumento = async (connection, id, valori) => {
    const campi = Object.keys(valori);
    const valoriArray = Object.values(valori);
    
    const setClauses = campi.map(campo => `${campo} = ?`);
    const sql = `UPDATE DOCUMENTO SET ${setClauses.join(', ')} WHERE id = ?`;
    
    const params = [...valoriArray, id];
    
    return await connection.query(sql, params);
};

const creaDocumento = async (connection, dati) => {

    const datiNotNull = {};

    Object.keys(dati).forEach(campo => {
        if(dati[campo] !== undefined && dati[campo] !== null && dati[campo] !== ''){
            datiNotNull[campo] = dati[campo];
        }
    });

    const campiNotNull = Object.keys(datiNotNull);

    const valori = Object.values(datiNotNull);
    const placeholders = campiNotNull.map(() => '?');

    const sql = `INSERT INTO DOCUMENTO (${campiNotNull.join(`, `)}) VALUES (${placeholders.join(', ')})`;

    return await connection.query(sql, valori);
};

module.exports = {creaDocumento, modificaDocumento, eliminaDocumento, mostraDocumenti, mostraDocumentobyId};