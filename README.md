# MindTrack — Aplicação de Apoio à TCC

Aplicação web full stack para auxiliar pacientes em acompanhamento psicológico baseado na **Terapia Cognitivo-Comportamental (TCC)**. Permite o registro de atividades cotidianas, avaliação de satisfação e acompanhamento pelo psicólogo.

---

## Tecnologias

| Camada      | Tecnologia                                |
|-------------|-------------------------------------------|
| Backend     | Python 3.11+, FastAPI, Uvicorn            |
| ORM         | SQLAlchemy 2.0                            |
| Banco       | SQLite                                    |
| Auth        | JWT (python-jose) + bcrypt (passlib)      |
| Validação   | Pydantic v2                               |
| Frontend    | React 18, Vite 5                          |
| Roteamento  | React Router v6                           |
| HTTP Client | Axios                                     |
| Estilo      | CSS puro com variáveis CSS                |

---

## Estrutura do Projeto

```
pi1/
├── backend/
│   ├── app/
│   │   ├── main.py               # Ponto de entrada FastAPI
│   │   ├── database.py           # Configuração SQLAlchemy
│   │   ├── models/models.py      # Modelos ORM (User, Task)
│   │   ├── schemas/schemas.py    # Schemas Pydantic
│   │   ├── routers/
│   │   │   ├── deps.py           # Dependências JWT
│   │   │   ├── auth.py           # Registro e Login
│   │   │   ├── tasks.py          # CRUD de tarefas (paciente)
│   │   │   └── psychologist.py   # Endpoints do psicólogo
│   │   └── services/
│   │       └── auth_service.py   # Hash de senha e JWT
│   ├── .env                      # Variáveis de ambiente
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/axios.js          # Instância Axios configurada
│   │   ├── context/AuthContext   # Contexto de autenticação
│   │   ├── components/           # Navbar, TaskCard, StarRating...
│   │   └── pages/                # Login, Register, Dashboards
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── generate_docs.py              # Script para gerar documentação .docx
└── README.md
```

---

## Como rodar localmente

### Pré-requisitos
- **Python** 3.11 ou superior — https://python.org
- **Node.js** 18 ou superior — https://nodejs.org

---

### 1. Backend

```bash
# Acesse a pasta do backend
cd backend

# Crie e ative um ambiente virtual
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Inicie o servidor (porta 8000)
uvicorn app.main:app --reload
```

O backend ficará disponível em: **http://localhost:8000**

Documentação interativa (Swagger): **http://localhost:8000/docs**

> O banco de dados SQLite (`tcc_app.db`) é criado automaticamente na pasta `backend/` na primeira execução.

---

### 2. Frontend

```bash
# Em outro terminal, acesse a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento (porta 5173)
npm run dev
```

O frontend ficará disponível em: **http://localhost:5173**

---

## Variáveis de Ambiente (backend/.env)

| Variável                      | Descrição                           | Padrão                          |
|-------------------------------|-------------------------------------|---------------------------------|
| `SECRET_KEY`                  | Chave secreta para JWT              | (definida no .env)              |
| `ALGORITHM`                   | Algoritmo JWT                       | `HS256`                         |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiração do token em minutos       | `1440` (24h)                    |
| `DATABASE_URL`                | URL do banco SQLite                 | `sqlite:///./tcc_app.db`        |

---

## Contas de teste

Após iniciar o sistema, cadastre usuários pela interface em **http://localhost:5173/register**.

- **Paciente**: selecione "Paciente" no cadastro para acessar o dashboard de tarefas.
- **Psicólogo**: selecione "Psicólogo(a)" para acessar a lista de pacientes.

---

## Funcionalidades

### Paciente
- Cadastro e login com JWT
- Criar tarefas com título, descrição e data prevista
- Marcar tarefas como concluídas
- Atribuir nota de satisfação (1–5 estrelas)
- Adicionar reflexão ao concluir
- Dashboard com estatísticas (total, concluídas, satisfação média)
- Filtro por status (todas / pendentes / concluídas)

### Psicólogo
- Visualizar lista de todos os pacientes
- Acessar tarefas de cada paciente
- Ver distribuição de satisfação com gráfico visual
- Acompanhar evolução do paciente

---

