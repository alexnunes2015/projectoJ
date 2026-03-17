# Visao Geral do Projeto

## Objetivo

Desenvolver uma solucao composta por aplicacao mobile e backoffice web para permitir que cidadaos reportem problemas no municipio e que administradores acompanhem, priorizem e resolvam essas ocorrencias.

Exemplos de problemas:

- Buracos
- Iluminacao publica avariada
- Lixo acumulado
- Danos em equipamentos urbanos
- Outras ocorrencias urbanas visiveis

## Proposta de valor

- O cidadao consegue reportar um problema de forma simples, com foto, localizacao e descricao.
- O municipio passa a ter uma base centralizada de relatos com historico e estado de tratamento.
- A analise automatica de imagem pode ajudar na classificacao inicial do relato.

## Publico-alvo

### Cidadaos

- Reportam problemas no municipio.
- Consultam historico de relatos enviados.

### Administradores do municipio

- Consultam relatos em backlog.
- Filtram por data, utilizador, tipo e estado.
- Acompanham e atualizam o ciclo de resolucao.

## Plataformas

| Camada | Tecnologia |
| --- | --- |
| Mobile | Flutter (Dart) |
| Backend | Firebase (Auth, Firestore, Cloud Functions, Storage) |
| IA | Google Vision API |
| Web Backoffice | React/Next.js + Firebase Admin SDK |

## Funcionalidades principais do MVP

### Mobile App

- Login e autenticacao.
- Captura de foto pela camera.
- Upload de foto pela galeria.
- Preview da foto antes do envio.
- Envio do relato com descricao e localizacao.
- Consulta dos resultados da analise.
- Historico de relatos anteriores.

### Backoffice Web

- Dashboard com visao geral.
- Galeria/lista de relatos.
- Pesquisa e filtros.
- Consulta de detalhe por relato.
- Gestao basica de estado do relato.
- Exportacao basica de dados.

## Escopo do MVP

### Incluido

- Fluxo completo de autenticacao.
- Criacao de relato com imagem.
- Armazenamento da imagem no Firebase Storage.
- Registo de metadados e resultado no Firestore.
- Trigger automatico para analise com Google Vision API.
- Consulta de historico no mobile.
- Consulta e gestao basica no backoffice.

### Fora do MVP inicial

- Notificacoes push.
- Workflow complexo de aprovacoes.
- Integracoes com sistemas externos do municipio.
- Analitica avancada.
- Offline-first.

## Criterios de sucesso do MVP

- Um cidadao autenticado consegue submeter um relato completo em poucos passos.
- O sistema guarda imagem, metadados e resultado da analise no backend.
- O backoffice consegue listar e filtrar relatos sem depender do mobile.
- O municipio consegue alterar o estado de um relato e acompanhar o historico.
