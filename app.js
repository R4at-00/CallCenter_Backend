const express = require('express');
const cors = require('cors');
const { poolPromise, sql } = require('./config/db');
const app = express();

//  Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.get('/api/clientes', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Clientes');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.get('/api/clientes/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Clientes WHERE id = @id');
        if (result.recordset.length === 0) {
            return res.status(404).send('Cliente no encontrado');
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.post('/api/clientes', async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('email', sql.VarChar, email)
            .query('INSERT INTO Clientes (nombre, email) VALUES (@nombre, @email); SELECT SCOPE_IDENTITY() AS id');
        res.status(201).json({ id: result.recordset[0].id, nombre, email });
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});