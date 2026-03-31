const express = require('express');
const bcrypt = require('bcryptjs');
const { listCollection } = require('../db');
const { requireMunicipioId } = require('./middleware');

const router = express.Router();

function omitPassword(user) {
  const { password, ...rest } = user;
  return rest;
}

router.post('/login', requireMunicipioId, async (req, res) => {
  const municipioId = req.municipioId;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email e password são obrigatórios' });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const users = await listCollection(
      'users',
      (user) => user.email === normalizedEmail && user.municipio_id === municipioId
    );
    const user = users[0];

    if (!user) {
      return res.status(401).json({ error: 'credenciais inválidas' });
    }

    const validPassword = bcrypt.compareSync(String(password), user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'credenciais inválidas' });
    }

    res.json({
      message: 'login efetuado com sucesso',
      user: omitPassword(user)
    });
  } catch (error) {
    res.status(500).json({ error: 'não foi possível efetuar login' });
  }
});

module.exports = router;
