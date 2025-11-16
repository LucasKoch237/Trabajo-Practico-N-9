const jwt = require('jsonwebtoken');
const CLAVE_SECRETA = process.env.CLAVE_SECRETA;

module.exports = function(req, res, next){
  const authHeader = req.headers['authorization'];
  if(!authHeader) return res.status(401).json({ error:'Token no provisto' });

  const parts = authHeader.split(' ');
  if(parts.length !== 2 || parts[0] !== 'Bearer')
    return res.status(401).json({ error:'Formato de token inválido' });

  try{
    const decoded = jwt.verify(parts[1], CLAVE_SECRETA);
    req.usuario = decoded;
    next();
  } catch{
    return res.status(401).json({ error:'Token inválido o expirado' });
  }
};