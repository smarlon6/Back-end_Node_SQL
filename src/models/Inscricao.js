const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inscricao = sequelize.define('Inscricao', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  curso_id: { type: DataTypes.INTEGER, allowNull: false },
  cancelada_em: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'inscricoes',
  timestamps: true,
});

module.exports = Inscricao;
