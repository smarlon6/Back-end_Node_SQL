const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const usuarioController = require('../controllers/usuarioController');
const cursoController = require('../controllers/cursoController');
const inscricaoController = require('../controllers/inscricaoController');

// Públicas
router.post('/usuarios', usuarioController.criarConta);
router.post('/login', usuarioController.login);
router.post('/cursos', cursoController.listarCursos);

// Protegidas
router.post('/cursos/:idCurso', auth, inscricaoController.inscrever);
router.delete('/cursos/:idCurso', auth, inscricaoController.cancelar);
router.get('/:idUsuario', auth, inscricaoController.listarInscritos);

module.exports = router;