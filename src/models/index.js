const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Curso = require('./Curso');
const Inscricao = require('./Inscricao');

Usuario.hasMany(Inscricao, { foreignKey: 'usuario_id' });
Inscricao.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Curso.hasMany(Inscricao, { foreignKey: 'curso_id' });
Inscricao.belongsTo(Curso, { foreignKey: 'curso_id' });

module.exports = { sequelize, Usuario, Curso, Inscricao };