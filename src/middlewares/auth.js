const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(403).json({ mensagem: 'Não autenticado' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, email }
    next();
  } catch (err) {
    return res.status(403).json({ mensagem: 'Token inválido' });
  }
}

module.exports = auth;