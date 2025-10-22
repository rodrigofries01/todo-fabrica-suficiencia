# Backend - Simple Todo API com JWT (SQLite)

API REST simples para gerenciamento de tarefas (To-Do) com autenticação por JWT, construída com Node.js, Express e SQLite.

## Visão geral

- Autenticação: registro e login com bcrypt + JWT
- Banco de dados: SQLite (arquivo `database.sqlite` local, criado automaticamente)
- Recursos: CRUD de tarefas por usuário autenticado
- CORS habilitado para uso com um frontend separado

## Tecnologias

- Node.js + Express
- SQLite3
- JSON Web Token (jsonwebtoken)
- bcrypt
- dotenv, cors, body-parser

## Estrutura de pastas

```
backend/
  db.js                 # conexão e migrações do SQLite (tabelas users e tasks)
  index.js              # bootstrap do servidor Express
  package.json          # dependências e scripts
  middleware/
    authMiddleware.js   # validação do token JWT (Bearer)
  routes/
    auth.js             # rotas de autenticação (register, login)
    tasks.js            # rotas protegidas de tarefas (CRUD)
```

## Requisitos

- Node.js 16+ (recomendado 18+)

## Instalação

Dentro de `backend/`:

```powershell
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` em `backend/` (opcional, mas recomendado em produção):

```
PORT=4000
JWT_SECRET=uma_chave_secreta_bem_grande_e_aleatoria
```

- `PORT`: porta do servidor (padrão: 4000)
- `JWT_SECRET`: segredo usado para assinar/verificar o token JWT

Observações:
- O banco SQLite é salvo localmente em `backend/database.sqlite` e é criado/migrado automaticamente por `db.js`.

## Como rodar

Ambiente de desenvolvimento (com reload automático via nodemon):

```powershell
npm run dev
```

Produção (Node direto):

```powershell
npm start
```

O servidor iniciará em `http://localhost:4000` (ou na `PORT` definida).

Rota de saúde rápida: `GET /` → "Todo API with JWT running"

## Autenticação

Este backend usa JWT no esquema Bearer.

- Inclua o header: `Authorization: Bearer <seu_token>` nas rotas protegidas (`/api/tasks/*`).
- O token é emitido no registro e no login e expira em 7 dias.

## Endpoints

Base URL: `http://localhost:4000`

### Auth

1) POST `/api/auth/register`
- Body (JSON):
  ```json
  { "name": "Seu Nome", "email": "email@exemplo.com", "password": "sua_senha" }
  ```
- Respostas:
  - 200 OK: `{ "token": "<JWT>" }`
  - 400 Bad Request: `Email and password required` | `Email already registered`
  - 500 Internal Server Error: mensagem de erro

Exemplo (PowerShell/curl):
```powershell
curl -X POST http://localhost:4000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Ana","email":"ana@example.com","password":"123456"}'
```

2) POST `/api/auth/login`
- Body (JSON):
  ```json
  { "email": "email@exemplo.com", "password": "sua_senha" }
  ```
- Respostas:
  - 200 OK: `{ "token": "<JWT>" }`
  - 400 Bad Request: `Invalid credentials` | `Email and password required`
  - 500 Internal Server Error: `DB error`

Exemplo:
```powershell
curl -X POST http://localhost:4000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"ana@example.com","password":"123456"}'
```

### Tasks (Protegido)
Inclua `Authorization: Bearer <token>`.

Modelo da tarefa:
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Comprar leite",
  "description": "Integral 1L",
  "done": 0,
  "created_at": "2025-10-22 12:34:56"
}
```

1) GET `/api/tasks`
- Lista todas as tarefas do usuário autenticado (ordenadas por `created_at` desc).
- Respostas:
  - 200 OK: `[{...}, {...}]`
  - 401 Unauthorized: token ausente/inválido

Exemplo:
```powershell
curl http://localhost:4000/api/tasks `
  -H "Authorization: Bearer <SEU_TOKEN>"
```

2) POST `/api/tasks`
- Cria uma tarefa
- Body (JSON):
  ```json
  { "title": "Comprar leite", "description": "Integral 1L" }
  ```
- Respostas:
  - 201 Created: objeto da tarefa criada
  - 400 Bad Request: `Title required`
  - 401 Unauthorized
  - 500 Internal Server Error: `DB error`

Exemplo:
```powershell
curl -X POST http://localhost:4000/api/tasks `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer <SEU_TOKEN>" `
  -d '{"title":"Comprar leite","description":"Integral 1L"}'
```

3) PUT `/api/tasks/:id`
- Atualiza uma tarefa (somente se pertencer ao usuário autenticado).
- Body (qualquer combinação): `title`, `description`, `done` (booleano → armazenado como 0/1)
- Respostas:
  - 200 OK: objeto da tarefa atualizada
  - 401 Unauthorized
  - 404 Not Found: quando a tarefa não pertence ao usuário ou não existe
  - 500 Internal Server Error: `DB error`

Exemplo:
```powershell
curl -X PUT http://localhost:4000/api/tasks/1 `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer <SEU_TOKEN>" `
  -d '{"done": true}'
```

4) DELETE `/api/tasks/:id`
- Remove uma tarefa do usuário
- Respostas:
  - 200 OK: `{ "message": "Deleted" }`
  - 401 Unauthorized
  - 500 Internal Server Error: `DB error`

Exemplo:
```powershell
curl -X DELETE http://localhost:4000/api/tasks/1 `
  -H "Authorization: Bearer <SEU_TOKEN>"
```

## Esquema do banco (SQLite)

Criado automaticamente em `db.js`:

- `users`
  - `id` INTEGER PK AUTOINCREMENT
  - `name` TEXT
  - `email` TEXT UNIQUE
  - `password` TEXT (bcrypt hash)

- `tasks`
  - `id` INTEGER PK AUTOINCREMENT
  - `user_id` INTEGER (FK → users.id)
  - `title` TEXT NOT NULL
  - `description` TEXT
  - `done` INTEGER DEFAULT 0 (0 = false, 1 = true)
  - `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP

Para resetar o banco local, pare o servidor e apague `database.sqlite`.

## Tratamento de erros

- 400: requisições inválidas (ex.: campos obrigatórios ausentes, credenciais inválidas)
- 401: token ausente, malformado (não `Bearer`) ou inválido/expirado
- 404: recurso não encontrado ou não pertence ao usuário
- 500: erros internos/SQLite (mensagem: `DB error` ou detalhe do erro)

## Dicas e troubleshooting

- Certifique-se de definir `JWT_SECRET` em produção.
- Se ocorrer erro de arquivo bloqueado no SQLite, feche processos que o estejam acessando e reinicie o servidor.
- Para testar rapidamente, use o `curl` do Windows PowerShell conforme exemplos acima.
- CORS já está habilitado; ajuste origens no `index.js` se necessário.

## Scripts úteis

```json
{
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

- `npm run dev`: inicia com reload automático
- `npm start`: inicia em modo normal

---

Pronto! Este README documenta instalação, configuração, autenticação e todas as rotas do backend.