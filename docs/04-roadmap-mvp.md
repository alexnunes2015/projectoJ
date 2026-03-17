# Roadmap Inicial do MVP

## Prioridades principais

1. Permitir que o cidadao faca login e submeta um relato com foto.
2. Guardar a imagem e os metadados numa infraestrutura simples e centralizada.
3. Processar a imagem com Google Vision API.
4. Expor os relatos num backoffice para consulta e gestao.

## Fase 1 - Fundacao

Objetivo: preparar a base tecnica e o dominio minimo.

- Configurar projeto Firebase.
- Definir autenticacao e perfis base.
- Definir colecoes iniciais no Firestore.
- Definir regras de seguranca iniciais.
- Preparar repositorio e padroes de projeto.

## Fase 2 - Mobile MVP

Objetivo: fechar o fluxo principal do cidadao.

- Ecras de login/signup.
- Captura de foto pela camera.
- Selecao de foto pela galeria.
- Preview antes de submeter.
- Formulario com descricao e localizacao.
- Historico de relatos enviados.

## Fase 3 - Processamento e IA

Objetivo: automatizar a analise das imagens.

- Trigger em Cloud Functions.
- Integracao com Google Vision API.
- Persistencia dos resultados no Firestore.
- Exibicao do resumo da analise no mobile e no backoffice.

## Fase 4 - Backoffice MVP

Objetivo: dar operacao minima ao municipio.

- Dashboard simples.
- Lista de relatos com filtros.
- Pagina de detalhe do relato.
- Alteracao de estado.
- Pesquisa por data, utilizador e tipo.

## Fase 5 - Melhorias opcionais

- Exportacao CSV/PDF.
- Relatorios e analitica.
- Gestao avancada de utilizadores.
- Notificacoes.
- Classificacao mais inteligente por IA.

## Definicao de pronto para o MVP

O MVP pode ser considerado pronto quando:

- O cidadao consegue autenticar-se e criar um relato completo.
- O backend processa a foto e guarda o resultado.
- O relato fica visivel no historico do mobile.
- O relato fica visivel e editavel no backoffice.

## Riscos e decisoes em aberto

- Custo e limites de uso da Google Vision API.
- Regras de seguranca do Firebase entre perfis `citizen` e `admin`.
- Qualidade real da classificacao por imagem para o contexto municipal.
- Necessidade de moderacao manual antes de expor resultados aos administradores.
