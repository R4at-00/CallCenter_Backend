const express = require('express');
const cors = require('cors');
const { poolPromise, sql } = require('./config/db');
const app = express();

//  Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.get('/api/incidencias', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Incidencias');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.get('/api/incidencias/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Incidencias WHERE id = @id');
        if (result.recordset.length === 0) {
            return res.status(404).send('Cliente no encontrado');
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.post('/api/incidencias', async (req, res) => {
    try {
        const { NHC, Fecha, Incidencia, Estado, Responsable, Prioridad, Clasificacion } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('NHC', sql.Char, NHC)
            .input('Fecha', sql.DateTime, Fecha)
            .input('Incidencia', sql.VarChar, Incidencia)
            .input('Estado', sql.Char, Estado)
            .input('Responsable', sql.VarChar, Responsable)
            .input('Prioridad', sql.VarChar, Prioridad)
            .input('Clasificacion', sql.VarChar, Clasificacion)
            .query('INSERT INTO Incidencias (NHC, Fecha, Incidencia, Estado, Responsable, Prioridad, Clasificacion) VALUES (@NHC, @Fecha, @Incidencia, @Estado, @Responsable, @Prioridad, @Clasificacion); SELECT SCOPE_IDENTITY() AS id');
        res.status(201).json({ id: result.recordset[0].id, NHC, Fecha, Incidencia, Estado, Responsable, Prioridad });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.patch('/api/incidencias/:id', async (req, res) => {
    try {
        const { Respuesta, Estado } = req.body;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('Respuesta', sql.VarChar, Respuesta)
            .input('Estado', sql.Char, Estado)
            .query('update Incidencias set Respuesta = @Respuesta, Estado = @Estado where id = @id; SELECT SCOPE_IDENTITY() AS id');
        res.status(201).json({ Estado, Respuesta });
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});