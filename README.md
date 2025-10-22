
# 📝 Todo Fabrica – Aplicação Web com Autenticação JWT

Aplicação web simples para gerenciamento de tarefas (CRUD) com autenticação de usuários via **JWT**, desenvolvida como parte da Prova de Suficiência da Fábrica de Software – UTFPR.

### link: [JIRA](https://rodrigo123.atlassian.net/jira/core/projects/TF1/list?atlOrigin=eyJpIjoiODA1ZmYzYzM4NzRjNGU2OWJiYzNjNTQ0OWMzMGI3M2MiLCJwIjoiaiJ9)

---

## ⚙️ Visão Geral

O projeto é dividido em duas partes:

- **Backend (Node.js + Express + SQLite)**:  
  API REST para autenticação e CRUD de tarefas, protegida com JWT.

- **Frontend (HTML + JS + Bootstrap 5)**:  
  Interface responsiva e leve para registrar, logar e gerenciar tarefas.

Fluxo principal:  
**Registrar → Login → Gerenciar Tarefas (criar, editar, excluir, marcar como concluída).**

---

## 🧩 Tecnologias Utilizadas

**Backend**
- Node.js + Express  
- SQLite3  
- JSON Web Token (JWT)  
- bcrypt  
- dotenv, cors, body-parser  

**Frontend**
- HTML5 + JavaScript puro  
- Bootstrap 5 (via CDN)  
- CSS customizado leve

---

## 📂 Estrutura de Pastas

```
backend/
  db.js                 # Conexão e migrações SQLite
  index.js              # Inicialização do servidor Express
  routes/
    auth.js             # Registro e login (JWT)
    tasks.js            # CRUD de tarefas (rotas protegidas)
  middleware/
    authMiddleware.js   # Verificação do token JWT
frontend/
  index.html            # Página inicial
  login.html            # Login de usuário
  register.html         # Registro de usuário
  tasks.html            # Lista e gerenciamento de tarefas
  style.css             # Estilos adicionais (Bootstrap + custom)
```

---

## 🔧 Requisitos

- Node.js 16+ (recomendado 18+)
- Navegador moderno (para o frontend)

---

## 🚀 Como Executar

### Backend

```bash
cd backend
npm install
npm run dev
```

O servidor iniciará em [http://localhost:4000](http://localhost:4000).

Crie um arquivo `.env` (opcional):

```
PORT=4000
JWT_SECRET=uma_chave_secreta_segura
```

O banco `database.sqlite` será criado automaticamente.

---

### Frontend

Opção 1 — Abrir direto:
- Abra `frontend/index.html` no navegador.

Opção 2 — Servidor local (recomendado):
```bash
cd frontend
python -m http.server 5500
```
Acesse: [http://localhost:5500](http://localhost:5500)

---

## 🔐 Autenticação JWT

Após login ou registro, o token JWT é salvo no `localStorage`.

- Header padrão nas rotas protegidas:
  ```
  Authorization: Bearer <token>
  ```
- O token expira em 7 dias.
- Cada usuário acessa apenas suas próprias tarefas.

---

## 🧠 Funcionalidades

- Registro e login de usuários
- Criação, listagem, edição e exclusão de tarefas
- Marcar tarefa como concluída/não concluída
- Logout (limpa o token)
- Interface estilizada com Bootstrap:
  - Navbar responsiva
  - Modais de edição
  - Listas com `list-group` e `btn-group-sm`
  - Feedback visual (botões, cores e hover)

---

## 🗃️ Esquema do Banco

### Tabela `users`
| Campo | Tipo | Descrição |
|--------|------|------------|
| id | INTEGER PK | Identificador único |
| name | TEXT | Nome do usuário |
| email | TEXT UNIQUE | E-mail do usuário |
| password | TEXT | Senha criptografada (bcrypt) |

### Tabela `tasks`
| Campo | Tipo | Descrição |
|--------|------|------------|
| id | INTEGER PK | Identificador da tarefa |
| user_id | INTEGER FK | Relacionado ao usuário |
| title | TEXT | Título da tarefa |
| description | TEXT | Descrição da tarefa |
| done | INTEGER | 0 = pendente / 1 = concluída |
| created_at | DATETIME | Data de criação |