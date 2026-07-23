# 🔗 Lizer — Link Organizer

Aplicação web para salvar, organizar e encontrar seus links rapidamente. Cadastre links com título, descrição e tags, agrupe-os em categorias e use a busca para achar o que precisa em segundos.

## ✨ Funcionalidades

- **Autenticação** — cadastro, login (JWT) e edição de perfil
- **Links** — criação, edição e exclusão, com título, URL, descrição, tags e favicon automático
- **Categorias** — organize os links em categorias personalizadas, com contagem de links por categoria
- **Busca** — filtro em tempo real por título, URL, descrição ou tags
- **Dark mode** — tema escuro com preferência salva no navegador
- **Interface responsiva** — utilizável em desktop e mobile

## 🏗️ Stack

**Frontend** — Vue 3 · Vite · Vue Router · Pinia · Axios · PrimeIcons · vue3-toastify

**Backend** — Node.js · Express · MongoDB (driver nativo) · JWT · bcrypt

## 📁 Estrutura

```
├── backend/          API REST (Express + MongoDB)
│   ├── config/        conexão com o banco
│   ├── middlewares/    autenticação JWT
│   ├── models/         acesso a dados (links, categorias, usuários)
│   ├── routes/          rotas da API
│   └── server.js        entrypoint (local e serverless)
├── frontend/         SPA (Vue 3 + Vite)
│   └── src/
│       ├── components/   componentes reutilizáveis (listas, formulários, modais)
│       ├── views/        páginas (Dashboard, Categorias, Login, etc.)
│       ├── stores/       estado global (Pinia)
│       ├── services/     chamadas à API
│       └── router/       rotas da SPA
└── vercel.json       configuração de deploy (Vercel Services)
```

## 🚀 Rodando localmente

Pré-requisitos: Node.js 20+ e uma instância do MongoDB (local ou Atlas).

### Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/` com:

```
MONGODB_URI=sua_connection_string_do_mongodb
JWT_SECRET=uma_chave_secreta
PORT=3000
```

```bash
node server.js
```

A API sobe em `http://localhost:3000` (health check em `/health`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173` e já aponta para a API local em desenvolvimento.

## ☁️ Deploy

O projeto é publicado como um único projeto na Vercel, usando o recurso [Services](https://vercel.com/docs/services) para servir o frontend (estático) e o backend (serverless) sob o mesmo domínio — configuração em [`vercel.json`](./vercel.json).
