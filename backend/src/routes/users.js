const express = require('express');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const { listCollection, insertItem, findById, updateItem } = require('../db');
const { requireMunicipioId } = require('./middleware');
const { userRoles } = require('../constants');

const router = express.Router();

function omitPassword(user) {
  const { password, ...rest } = user;
  return rest;
}

router.get('/', requireMunicipioId, async (req, res) => {
  try {
    const municipioId = req.municipioId;
    const { role } = req.query;
    let users = await listCollection('users', (user) => user.municipio_id === municipioId);
    if (role) {
      users = users.filter((user) => user.role === role);
    }
    res.json(users.map(omitPassword));
  } catch (error) {
    res.status(500).json({ error: 'não foi possível listar os utilizadores' });
  }
});

router.post('/', requireMunicipioId, async (req, res) => {
  const municipioId = req.municipioId;
  const { nome, email, password, role } = req.body;

  if (!nome || !email || !password || !role) {
    return res.status(400).json({ error: 'nome, email, password e role são obrigatórios' });
  }

  if (!userRoles.includes(role)) {
    return res.status(400).json({ error: `role inválido (valores esperados: ${userRoles.join(', ')})` });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await listCollection('users', (user) => user.email === normalizedEmail && user.municipio_id === municipioId);
  if (existing.length > 0) {
    return res.status(409).json({ error: 'email já registado neste município' });
  }

  const user = {
    id: nanoid(),
    nome: String(nome).trim(),
    email: normalizedEmail,
    password: bcrypt.hashSync(password, 10),
    role,
    municipio_id: municipioId,
    created_at: new Date().toISOString()
  };

  try {
    await insertItem('users', user);
    res.status(201).json(omitPassword(user));
  } catch (error) {
    res.status(500).json({ error: 'não foi possível criar o utilizador' });
  }
});

router.patch('/:id', requireMunicipioId, async (req, res) => {
  const municipioId = req.municipioId;
  const user = await findById('users', req.params.id);
  if (!user || user.municipio_id !== municipioId) {
    return res.status(404).json({ error: 'utilizador não encontrado' });
  }

  const changes = {};
  if (req.body.nome) {
    changes.nome = String(req.body.nome).trim();
  }
  if (req.body.role) {
    if (!userRoles.includes(req.body.role)) {
      return res.status(400).json({ error: `role inválido (valores esperados: ${userRoles.join(', ')})` });
    }
    changes.role = req.body.role;
  }
  if (req.body.password) {
    changes.password = bcrypt.hashSync(String(req.body.password), 10);
  }

  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ error: 'nenhum campo válido foi enviado' });
  }

  try {
    const updated = await updateItem('users', user.id, changes);
    res.json(omitPassword(updated));
  } catch (error) {
    res.status(500).json({ error: 'não foi possível atualizar o utilizador' });
  }
});

module.exports = router;
