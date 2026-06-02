# BarBet MVP

BarBet e uma webapp mobile-first para bares com bolao recreativo em "cervejas" simbolicas. Nao usa dinheiro real, nao tem pagamento, saque ou odds reais. O foco do MVP e QR Code por mesa, palpites em jogos, painel admin e ranking interno do bar.

## Stack

- Backend: Java 21, Spring Boot 3, Spring Web, Spring Data JPA, Bean Validation, Lombok, PostgreSQL, Maven
- Frontend: React 18, Vite, TypeScript, React Router DOM, Axios, Zustand, TailwindCSS
- Infra: Docker Compose + PostgreSQL

## Estrutura

```txt
backend/
frontend/
database/
docker-compose.yml
```

## Como rodar

1. Tenha Docker e Docker Compose instalados.
2. Na raiz do projeto, rode:

```bash
docker-compose up --build
```

3. Acesse:

- Frontend cliente: `http://localhost:5173`
- Frontend admin: `http://localhost:5173/admin/login`
- API backend: `http://localhost:8080/api`

## Credenciais admin

```txt
email: admin@barbet.com
senha: 123456
```

## Fluxo do cliente

1. Abra `http://localhost:5173/bar/bar-do-teco/mesa/MESA01`
2. Informe apelido e, se quiser, telefone
3. Entre na mesa
4. Veja jogos abertos
5. Faça um palpite com vencedor, placar opcional e 1 a 20 cervejas simbolicas
6. Acompanhe seus palpites em `Meus palpites`

## Fluxo admin

1. Entre em `/admin/login`
2. Veja dashboard
3. Crie ou edite jogos
4. Feche apostas
5. Lance resultado com gols
6. Veja ranking atualizado
7. Gere e visualize QR Code das mesas

## Seed inicial

Ao subir o backend pela primeira vez, o sistema cria automaticamente:

- Bar: `Bar do Teco`
- Slug: `bar-do-teco`
- Mesas: `MESA01`, `MESA02`, `MESA03`
- Jogos:
  - `Brasil x Argentina`
  - `Franca x Alemanha`
  - `Portugal x Espanha`

## Regras do MVP

- Apenas 1 palpite por cliente por jogo
- Jogo fechado ou finalizado nao aceita nova aposta
- Minimo de 1 cerveja e maximo de 20 por palpite
- Acertar vencedor: `3 pontos`
- Acertar placar: `5 pontos`
- Ao finalizar um jogo, os vencedores dividem igualmente as cervejas apostadas pelos perdedores
- O bar retira `1 cerveja` fixa por jogo liquidado com vencedores
- Sessao cliente simples via `localStorage`
- Admin autenticado via JWT simples

## Endpoints principais

### Cliente

```http
POST /api/customers/enter
GET /api/matches/open?barSlug=bar-do-teco
POST /api/bets
GET /api/customers/{id}/bets
```

### Admin

```http
POST /api/admin/auth/login
GET /api/admin/dashboard
GET /api/admin/matches
POST /api/admin/matches
PUT /api/admin/matches/{id}
PATCH /api/admin/matches/{id}/close
PATCH /api/admin/matches/{id}/finish
GET /api/admin/ranking
POST /api/admin/tables
GET /api/admin/tables
GET /api/admin/tables/{id}/qrcode
```

## Variaveis de ambiente

As variaveis padrao estao em `.env` na raiz e exemplos locais em:

- [backend/.env.example](/C:/Users/Teco/BarBet/backend/.env.example)
- [frontend/.env.example](/C:/Users/Teco/BarBet/frontend/.env.example)

## Deploy: Vercel + Railway

- O deploy atual da Vercel publica apenas o frontend porque o [vercel.json](/C:/Users/Teco/BarBet/vercel.json) compila somente `frontend/`
- O backend Spring Boot deve ser publicado separadamente no Railway, usando a pasta `backend/`
- O backend agora respeita a porta `PORT` injetada pelo Railway e expõe `GET /api/health` para healthcheck

### Backend no Railway

1. Crie um novo projeto no Railway
2. Adicione um serviço `PostgreSQL`
3. Adicione um segundo serviço a partir deste repositório GitHub
4. No serviço do backend, configure `Root Directory` como `/backend`
5. Em `Variables`, defina:

```env
SPRING_DATASOURCE_URL=${{Postgres.DATABASE_URL}}
SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{Postgres.PGPASSWORD}}
APP_JWT_SECRET=troque-este-segredo
APP_JWT_EXPIRATION_MINUTES=720
APP_ADMIN_EMAIL=admin@barbet.com
APP_ADMIN_PASSWORD=troque-esta-senha
APP_FRONTEND_BASE_URL=https://seu-frontend.vercel.app
APP_CORS_ALLOWED_ORIGIN_PATTERNS=http://localhost:5173,http://127.0.0.1:5173,https://*.vercel.app
```

6. Em `Networking`, gere um dominio publico para o backend

### Frontend no Vercel

1. Mantenha o projeto atual da Vercel apontando para este repositorio
2. Em `Environment Variables`, defina:

```env
VITE_API_URL=https://seu-backend.up.railway.app/api
```

3. Faça um novo deploy no Vercel depois de salvar a variavel

## Observacoes

- O QR Code aponta para rotas do frontend local, por exemplo `http://localhost:5173/bar/bar-do-teco/mesa/MESA01`
- O backend usa `ddl-auto=update` para simplificar o MVP
- O projeto foi mantido propositalmente simples, sem gateway, saque, OAuth, microservicos ou Kubernetes
