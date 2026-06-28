## Autor

Marlon — Disciplina de Back-end Node.js com SQL

# Plataforma de Cursos — Back-end

API REST para uma plataforma de cursos, desenvolvida em **Node.js + Express** com banco de dados relacional via **Sequelize**. Permite cadastro e login de alunos, listagem de cursos disponíveis, inscrição, cancelamento de inscrição e consulta dos cursos em que o aluno está inscrito.

Projeto desenvolvido para a disciplina de **Back-end Node.js com SQL**.

## Funcionalidades

- Cadastro de alunos (nome, email, senha e data de nascimento), com email único.
- Login com autenticação via **JWT** armazenado em cookie `httpOnly`.
- Senhas armazenadas com hash (bcrypt).
- Listagem de cursos disponíveis (apenas os que ainda não iniciaram), com contagem de inscritos e filtro opcional por nome.
- Inscrição em curso (um aluno só pode se inscrever uma vez em cada curso).
- Cancelamento de inscrição: o registro **não é apagado** — é gravada a data/hora do cancelamento, o que impede uma nova inscrição no mesmo curso.
- Listagem dos cursos em que o aluno está inscrito, incluindo os que ele cancelou.

## Tecnologias

- Node.js
- Express
- Sequelize (ORM)
- SQLite (desenvolvimento) — facilmente substituível por PostgreSQL/MySQL via variáveis de ambiente
- JSON Web Token (jsonwebtoken)
- bcryptjs
- cookie-parser
- cors
- dotenv

## Pré-requisitos

- Node.js instalado (versão 18 ou superior recomendada)
- npm

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/smarlon6/Back-end_Node_SQL.git
cd Back-end_Node_SQL

# Instalar as dependências
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
PORT=3000
JWT_SECRET=seu_segredo_forte_aqui
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite
```

> O arquivo `.env` não é versionado por segurança. Use o exemplo acima como base.

## Como executar

```bash
# Popular o banco com cursos de exemplo (opcional, recomendado na primeira execução)
npm run seed

# Iniciar a aplicação
npm start
```

O servidor sobe em `http://localhost:3000`.

Para desenvolvimento com recarregamento automático:

```bash
npm run dev
```

## Rotas da API

Todas as requisições e respostas são em formato **JSON**.

| Ação | Método | Rota | Corpo (envio) | Autenticação |
|------|--------|------|---------------|--------------|
| Criar conta | POST | `/usuarios` | `{ "nome", "email", "senha", "nascimento": "dd/mm/aaaa" }` | Não |
| Login | POST | `/login` | `{ "email", "senha" }` | Não |
| Listar cursos | POST | `/cursos` | `{ "filtro": "opcional" }` | Opcional |
| Inscrever em curso | POST | `/cursos/:idCurso` | — | Sim (JWT) |
| Cancelar inscrição | DELETE | `/cursos/:idCurso` | — | Sim (JWT) |
| Listar cursos inscritos | GET | `/:idUsuario` | — | Sim (JWT) |

### Respostas

- **Criar conta:** `200` em caso de sucesso; `400` com `{ "mensagem": "..." }` em caso de erro.
- **Login:** `200` com o JWT configurado nos cookies; `400` com `{ "mensagem": "..." }` em caso de erro.
- **Listar cursos:** sempre `200` com um array de cursos (vazio se não houver resultados).
- **Inscrever / Cancelar:** `200` em caso de sucesso; `403` se não estiver logado; `404` se o curso não existir; `400` com `{ "mensagem": "..." }` em caso de erro.
- **Listar cursos inscritos:** `403` se o id da rota não for o do usuário logado; caso contrário `200` com array de cursos.

## Estrutura do projeto

```
plataforma-cursos/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── index.js
│   │   ├── Usuario.js
│   │   ├── Curso.js
│   │   └── Inscricao.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── controllers/
│   │   ├── usuarioController.js
│   │   ├── cursoController.js
│   │   └── inscricaoController.js
│   ├── routes/
│   │   └── index.js
│   ├── seed.js
│   └── app.js
├── .env
├── .gitignore
└── package.json
```

