require('dotenv').config();
const express = require('express');
const app = express();

const usuariosRouter = require('./routes/usuarios');
const privadasRouter = require('./routes/privadas');

const PUERTO = process.env.PUERTO || 3000;

app.use(express.json());

app.use('/api/usuarios', usuariosRouter);
app.use('/api/privado', privadasRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en puerto ${PUERTO}`);
});