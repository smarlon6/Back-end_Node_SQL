const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { Curso, Inscricao } = require('../models');
require('dotenv').config();

function formatarDataBR(data) {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
}

// Tenta identificar o usuário pelo cookie (rota pública, login opcional)
function usuarioOpcional(req) {
  const token = req.cookies?.token;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

exports.listarCursos = async (req, res) => {
  try {
    const filtro = req.body?.filtro;
    const usuario = usuarioOpcional(req);
    const hoje = new Date();

    const where = {
      inicio: { [Op.gt]: hoje }, // só cursos ainda não iniciados
    };
    if (filtro) {
      where.nome = { [Op.like]: `%${filtro}%` };
    }

    const cursos = await Curso.findAll({ where });

    const resultado = await Promise.all(cursos.map(async (curso) => {
      const inscricoes = await Inscricao.count({
        where: { curso_id: curso.id, cancelada_em: null },
      });

      let inscrito = false;
      if (usuario) {
        const minhaInscricao = await Inscricao.findOne({
          where: { curso_id: curso.id, usuario_id: usuario.id, cancelada_em: null },
        });
        inscrito = !!minhaInscricao;
      }

      return {
        id: curso.id,
        nome: curso.nome,
        descricao: curso.descricao,
        capa: curso.capa,
        inscricoes,
        inicio: formatarDataBR(curso.inicio),
        inscrito,
      };
    }));

    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(200).json([]);
  }
};