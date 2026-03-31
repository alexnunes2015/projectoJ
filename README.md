# projectoJ

Repositório com três aplicações separadas:

- `backend/` - API Node/Express.
- `backoffice/` - front-end web do backoffice.
- `mobile_mockup/` - app Flutter.

## Arranque por aplicação

### Backend

```bash
npm run dev:backend
```

### Backoffice

```bash
npm run dev:backoffice
```

Abre `http://localhost:4173`.

O `backoffice` é uma app Vite + React e usa proxy local para o `backend` em `http://127.0.0.1:4000`.

### Mobile

```bash
npm run dev:mobile
```

## Notas

- O backend e o backoffice estão desacoplados.
- O backoffice atual é um protótipo estático servido por um servidor Node simples.
- O mobile continua a ser um mockup sem integração real com backend.
