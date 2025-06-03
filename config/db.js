const sql = require('mssql');
const sql = require('msnodesqlv8');
const config = {
    // user: 'BETICA\\dfpadilla50c',
    // password: '',
    server: 'C07-INF-PRACT\\SQLEXPRESS', // o la dirección de tu servidor
    driver: 'msnodesqlv8',
    database: 'CallCenter',
    options: {
        trustedConnection: true,
        encrypt: false, // para Azure
        trustServerCertificate: true // para desarrollo local
    }
};
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
    console.log('Conectado a SQL Server');
    return pool;})
    .catch (err => console.log('Error de conexión a la base de datos: ', err));
module.exports = {
    sql, poolPromise
};
