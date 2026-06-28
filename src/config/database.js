const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configurado para SQLite agora, mas trocar para Postgres/MySQL
// no Railway é só mudar as variáveis de ambiente.
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || './database.sqlite',
  logging: false,
});

module.exports = sequelize;