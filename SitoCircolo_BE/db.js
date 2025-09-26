const mysql = require("mysql2/promise");

const db = {
    host: "localhost",
    user: "root",
    password: "Emanuele2301-",
    database: "circoloDB",
};

const pool = mysql.createPool({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
    port: db.port || 3306,
    connectionLimit: 10         
});

async function getConnection() {
    return await pool.getConnection();
}

async function execute(connection, sql, params){
    const [results] = await connection.execute(sql, params);
    return results;
}

async function query(sql, params = []) {
    const [results] = await pool.execute(sql, params);
    return results;
}

module.exports = {getConnection, execute, query, pool};

