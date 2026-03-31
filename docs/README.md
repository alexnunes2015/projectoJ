# Documentacao Inicial

Este diretorio concentra a documentacao inicial do MVP de uma plataforma para reporte e gestao de problemas municipais.

## Objetivo desta pasta

- Alinhar o escopo do produto antes de escrever codigo.
- Registar a arquitetura tecnica base do MVP.
- Definir uma proposta inicial de dados e fases de execucao.

## Conteudo

- [`01-visao-geral.md`](./01-visao-geral.md) - objetivo, publico-alvo, plataformas e funcionalidades principais.
- [`02-arquitetura-mvp.md`](./02-arquitetura-mvp.md) - stack, componentes, fluxo tecnico e modulos do sistema.
- [`03-modelo-dados-inicial.md`](./03-modelo-dados-inicial.md) - proposta inicial para Firestore, Storage e estados do relato.
- [`04-roadmap-mvp.md`](./04-roadmap-mvp.md) - prioridades, fases de implementacao e decisoes em aberto.

## Resumo rapido

O produto tera tres blocos principais:

1. App mobile em Flutter para o cidadao reportar ocorrencias com foto, localizacao e descricao.
2. Backend para autenticacao, armazenamento, processamento e persistencia dos dados.
3. Backoffice web para o municipio consultar, filtrar e gerir relatos.

A analise automatica de imagem sera feita com Google Vision API, acionada a partir de Cloud Functions apos upload da foto.

## Estrutura atual do repositorio

- `backend/` - API Node/Express com persistencia local em JSON.
- `backoffice/` - front-end web separado do backend.
- `mobile_mockup/` - app Flutter/mockup mobile.

## Estado atual

Esta documentacao foi criada a partir do material inicial do projeto e deve ser tratada como a primeira versao do MVP. Os pontos marcados como "a validar" devem ser confirmados antes da implementacao detalhada.
