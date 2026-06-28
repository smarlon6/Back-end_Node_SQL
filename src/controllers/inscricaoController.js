const { Curso, Inscricao } = require('../models');

function formatarDataBR(data) {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
}

exports.inscrever = async (req, res) => {
  try {
    const cursoId = req.params.idCurso;
    const usuarioId = req.usuario.id;

    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
      return res.status(404).json({ mensagem: 'Curso não encontrado' });
    }

    const existente = await Inscricao.findOne({
      where: { curso_id: cursoId, usuario_id: usuarioId },
    });

    if (existente) {
      // Se já cancelou antes, não pode reinscrever
      if (existente.cancelada_em) {
        return res.status(400).json({ mensagem: 'Inscrição cancelada anteriormente, não é possível reinscrever' });
      }
      return res.status(400).json({ mensagem: 'Você já está inscrito neste curso' });
    }

    await Inscricao.create({ curso_id: cursoId, usuario_id: usuarioId });
    return res.status(200).json({ mensagem: 'Inscrição realizada com sucesso' });
  } catch (err) {
    return res.status(400).json({ mensagem: err.message });
  }
};

exports.cancelar = async (req, res) => {
  try {
    const cursoId = req.params.idCurso;
    const usuarioId = req.usuario.id;

    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
      return res.status(404).json({ mensagem: 'Curso não encontrado' });
    }

    const inscricao = await Inscricao.findOne({
      where: { curso_id: cursoId, usuario_id: usuarioId, cancelada_em: null },
    });

    if (!inscricao) {
      return res.status(400).json({ mensagem: 'Você não possui inscrição ativa neste curso' });
    }

    inscricao.cancelada_em = new Date();
    await inscricao.save();

    return res.status(200).json({ mensagem: 'Inscrição cancelada com sucesso' });
  } catch (err) {
    return res.status(400).json({ mensagem: err.message });
  }
};

exports.listarInscritos = async (req, res) => {
  try {
    const idRota = String(req.params.idUsuario);
    const idLogado = String(req.usuario.id);

    if (idRota !== idLogado) {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }

    const inscricoes = await Inscricao.findAll({
      where: { usuario_id: idLogado },
      include: [Curso],
    });

    const resultado = await Promise.all(inscricoes.map(async (insc) => {
      const curso = insc.Curso;
      const totalInscricoes = await Inscricao.count({
        where: { curso_id: curso.id, cancelada_em: null },
      });

      return {
        id: curso.id,
        nome: curso.nome,
        descricao: curso.descricao,
        capa: curso.capa,
        inscricoes: totalInscricoes,
        inicio: formatarDataBR(curso.inicio),
        inscricao_cancelada: !!insc.cancelada_em,
        inscrito: true,
      };
    }));

    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(200).json([]);
  }
};