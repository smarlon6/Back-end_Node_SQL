const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
require('dotenv').config();

// Converte "dd/mm/aaaa" -> objeto Date
function parseDataBR(str) {
  if (!str || typeof str !== 'string') return null;
  const partes = str.split('/');
  if (partes.length !== 3) return null;
  const [dia, mes, ano] = partes.map(Number);
  const data = new Date(ano, mes - 1, dia);
  if (isNaN(data.getTime())) return null;
  return data;
}

exports.criarConta = async (req, res) => {
  try {
    const { nome, email, senha, nascimento } = req.body;

    if (!nome || !email || !senha || !nascimento) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios: nome, email, senha, nascimento' });
    }

    const dataNasc = parseDataBR(nascimento);
    if (!dataNasc) {
      return res.status(400).json({ mensagem: 'Data de nascimento inválida (use dd/mm/aaaa)' });
    }

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      nascimento: dataNasc,
    });

    return res.status(200).json({ id: usuario.id, mensagem: 'Conta criada com sucesso' });
  } catch (err) {
    return res.status(400).json({ mensagem: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ mensagem: 'Credenciais inválidas' });
    }

    const ok = await bcrypt.compare(senha, usuario.senha);
    if (!ok) {
      return res.status(400).json({ mensagem: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ mensagem: 'Login realizado com sucesso' });
  } catch (err) {
    return res.status(400).json({ mensagem: err.message });
  }
};