const mysql = require("mysql2/promise");
const config = require("./config");

async function getConnection() {
    const connection=await mysql.createConnection(config.db);
    return connection;
};


module.exports = {getConnection};

