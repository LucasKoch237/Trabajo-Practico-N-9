const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const usuarios = new Map();
let nextId = 1;

const CLAVE_SECRETA = process.env.CLAVE_SECRETA;

router.post('/registro', async (req, res, next) => {
  try{
    const { username, password } = req.body || {};
    if(!username || username.length < 3)
      return res.status(400).json({ error: 'username requerido (mínimo 3 caracteres)'});
    if(!password || password.length < 6)
      return res.status(400).json({ error: 'password requerido (mínimo 6 caracteres)'});

    for(const u of usuarios.values()){
      if(u.username === username)
        return res.status(409).json({ error: 'Nombre de usuario ya en uso' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = nextId++;
    const user = { id, username, passwordHash };
    usuarios.set(id, user);

    res.status(201).json({ id, username });
  }catch (err) { next(err); }
});

router.post('/acceso', async (req, res, next) => {
  try{
    const { username, password } = req.body || {};
    if(!username || !password)
      return res.status(400).json({ error: 'username y password requeridos'});

    let user = null;
    for(const u of usuarios.values()) {
      if(u.username === username) {user = u; break;}
    }
    if(!user) return res.status(401).json({error: 'Credenciales inválidas'});

    const match = await bcrypt.compare(password, user.passwordHash);
    if(!match) return res.status(401).json({error: 'Credenciales inválidas'});

    const token = jwt.sign({id: user.id, username: user.username}, CLAVE_SECRETA, {expiresIn:'1h'});

    res.json({token});
  } catch (err) {next(err);}
});

module.exports = router;