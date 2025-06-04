const sql = require('mssql');
// import sql from "mssql";
const config = {
    user: 'diego',
    password: 'nosql1234',
    server: 'C07-INF-PRACT', // o la dirección de tu servidor
    database: 'CallCenter',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        instanceName: "SQLEXPRESS01",
        trustServerCertificate: true,
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a SQL Server');
        return pool;
    })
    .catch(err => console.log('Error de conexión a la base de datos: ', err)
);
module.exports = {
    sql, poolPromise
};