# Modelo de Dados Inicial

Este documento descreve uma proposta inicial para estruturar os dados do MVP. E uma base de partida e pode ser ajustada quando os primeiros ecras e fluxos estiverem fechados.

## Colecoes principais no Firestore

### `users`

Regista o perfil minimo do utilizador autenticado.

| Campo | Tipo | Descricao |
| --- | --- | --- |
| `uid` | string | Identificador do utilizador no Firebase Auth |
| `name` | string | Nome visivel |
| `email` | string | Email do utilizador |
| `role` | string | `citizen` ou `admin` |
| `createdAt` | timestamp | Data de criacao |
| `updatedAt` | timestamp | Data de atualizacao |

### `reports`

Colecao principal das ocorrencias reportadas.

| Campo | Tipo | Descricao |
| --- | --- | --- |
| `id` | string | Identificador do relato |
| `userId` | string | Referencia ao utilizador que criou |
| `title` | string | Titulo curto opcional |
| `description` | string | Descricao textual |
| `status` | string | `submitted`, `in_review`, `resolved`, `rejected` |
| `category` | string | Categoria principal, manual ou sugerida por IA |
| `imageUrl` | string | URL da imagem no Storage |
| `imagePath` | string | Caminho interno no Storage |
| `location` | map | Latitude, longitude e morada opcional |
| `aiAnalysis` | map | Resultado resumido da analise |
| `source` | string | `camera` ou `gallery` |
| `createdAt` | timestamp | Data de criacao |
| `updatedAt` | timestamp | Data de atualizacao |

### `report_events`

Historico de alteracoes relevantes por relato.

| Campo | Tipo | Descricao |
| --- | --- | --- |
| `reportId` | string | Relato associado |
| `type` | string | Tipo de evento |
| `actorId` | string | Quem executou a acao |
| `payload` | map | Dados complementares |
| `createdAt` | timestamp | Data do evento |

## Estrutura sugerida para Storage

```text
/reports/{userId}/{reportId}/original.jpg
```

Opcionalmente, o backend pode criar tambem:

```text
/reports/{userId}/{reportId}/thumb.jpg
/reports/{userId}/{reportId}/processed.json
```

## Estrutura sugerida para `location`

```json
{
  "lat": 0,
  "lng": 0,
  "address": "string"
}
```

## Estrutura sugerida para `aiAnalysis`

```json
{
  "provider": "google-vision",
  "status": "pending",
  "labels": [],
  "objects": [],
  "safeSearch": {},
  "summary": "string"
}
```

## Estados sugeridos do relato

| Estado | Significado |
| --- | --- |
| `submitted` | Relato criado pelo cidadao |
| `in_review` | Em triagem ou validacao pelo municipio |
| `resolved` | Problema resolvido |
| `rejected` | Relato invalido, duplicado ou fora de ambito |

## Consultas importantes para o MVP

- Listar relatos de um utilizador por `createdAt`.
- Listar relatos por `status`.
- Filtrar relatos por data.
- Filtrar relatos por categoria.
- Filtrar relatos por utilizador.

## Campos a validar antes da implementacao

- Se `title` sera obrigatorio ou gerado automaticamente.
- Se `category` sera manual, automatica ou hibrida.
- Se `aiAnalysis` fica embutido no documento principal ou em subcolecao propria.
- Se o historico (`report_events`) sera necessario desde a primeira versao.
