const { sequelize, Curso } = require('./models');

async function seed() {
  await sequelize.sync({ force: false });

  const cursos = [
    {
      nome: 'Node.js do Zero',
      descricao: 'Aprenda back-end com Node.js e Express',
      capa: 'https://via.placeholder.com/300x180?text=Node.js',
      inicio: '2026-09-01',
    },
    {
      nome: 'SQL para Desenvolvedores',
      descricao: 'Modelagem e consultas em bancos relacionais',
      capa: 'https://via.placeholder.com/300x180?text=SQL',
      inicio: '2026-10-15',
    },
    {
      nome: 'JavaScript Moderno',
      descricao: 'ES6+, async/await e boas práticas',
      capa: 'https://via.placeholder.com/300x180?text=JS',
      inicio: '2026-08-20',
    },
  ];

  for (const c of cursos) {
    await Curso.create(c);
  }

  console.log('Seed concluído!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});