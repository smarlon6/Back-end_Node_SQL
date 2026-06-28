const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/', routes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Banco sincronizado.');
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch((err) => {
  console.error('Erro ao sincronizar o banco:', err);
});