const express = require('express');
const router = express.Router();
const autenticacion = require('../middlewares/autenticacion');

router.get('/perfil', autenticacion, (req, res) => {
  res.json({ mensaje: 'Acceso concedido', usuario: req.usuario });
});

module.exports = router;