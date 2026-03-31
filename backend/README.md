# Backend service

Esta pasta contém um servidor Node/Express minimalista que materializa o modelo de dados descrito em `docs/MODELO DE DADOS.pdf`. A API é multi-tenant: todos os dados principais têm um `municipio_id` e, por isso, todas as rotas administrativas exigem que esse identificador seja passado como header ou query/body.

## Stack

* `node >= 18`
* Express para routing
* Lowdb para persistência leve (`backend/data/store.json`)

## Getting started

```bash
cd backend
npm install
npm run dev    # reinicia automaticamente quando há alterações
npm start      # executa o entry point em produção
```

## Multi-tenant

Defina `x-municipio-id` em todos os pedidos que alterem o estado dos dados (users, categorias, ocorrências, histórico). O mesmo valor pode ser passado como `municipio_id` em body/query se preferir.

## Credenciais seed

O backend arranca com um município e utilizador base:

- `municipio_id`: `municipio-root`
- `email`: `root`
- `password`: `root`

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Liveness probe com carimbo temporal. |
| `POST` | `/api/auth/login` | Login de backoffice com `email`, `password` e `x-municipio-id`. |
| `GET` | `/api/municipios` | Lista municípios. |
| `POST` | `/api/municipios` | Cria um município (body: `nome`). |
| `GET` | `/api/reports` | Lista de ocorrências filtrada por `status`, `user_id`, `categoria_id`, `from`, `to`. |
| `GET` | `/api/reports/:id` | Lê uma ocorrência. |
| `POST` | `/api/reports` | Cria ocorrências (body em português; veja abaixo). |
| `PATCH` | `/api/reports/:id` | Atualiza campos mutáveis e categorias associadas. |
| `DELETE` | `/api/reports/:id` | Remove uma ocorrência e limpa dependências. |
| `GET` | `/api/users` | Lista utilizadores do município. |
| `POST` | `/api/users` | Cria utilizadores (`nome`, `email`, `password`, `role`). |
| `PATCH` | `/api/users/:id` | Atualiza nome, role ou password. |
| `GET` | `/api/categories` | Lista categorias do município. |
| `POST` | `/api/categories` | Cria uma categoria (`nome`). |
| `PATCH` | `/api/categories/:id` | Altera o nome da categoria. |
| `DELETE` | `/api/categories/:id` | Remove a categoria. |
| `GET` | `/api/report-updates` | Lista histórico de um `report_id`. |
| `POST` | `/api/report-updates` | Adiciona uma entrada de histórico (status/comentário). |
| `GET` | `/` | Resumo simples da API e rotas disponíveis. |

## Exemplos

`POST /api/reports`

```json
{
  "titulo": "Sinalização arrancada",
  "descricao": "A placa de limite de velocidade foi arrancada há dias.",
  "imagem_url": "https://cdn.exemplo.com/sign.png",
  "latitude": -9.142,
  "longitude": 38.717,
  "status": "pendente",
  "user_id": "user-123",
  "categorias": ["cat-reciclagem", "cat-sinalizacao"]
}
```

`POST /api/users`

```json
{
  "nome": "Ana Moura",
  "email": "ana@exemplo.pt",
  "password": "senha-segura",
  "role": "operador"
}
```

`POST /api/report-updates`

```json
{
  "report_id": "report-xyz",
  "status": "em_progresso",
  "comentario": "Técnico a caminho",
  "updated_by": "user-789"
}
```

## Persistence

Os registos são guardados em `backend/data/store.json`. O helper `src/db.js` mantém tudo sincronizado com o ficheiro JSON.

Consulte `docs/MODELO DE DADOS.pdf` para o alinhamento completo do PostgreSQL e adapte para uma base persistente no futuro.
