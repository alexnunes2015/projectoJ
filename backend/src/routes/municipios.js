const express = require('express');
const { nanoid } = require('nanoid');
const { listCollection, insertItem } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const municipios = await listCollection('municipios');
    res.json(municipios);
  } catch (error) {
    res.status(500).json({ error: 'não foi possível listar os municípios' });
  }
});

router.post('/', async (req, res) => {
  const { nome } = req.body;
  if (!nome || typeof nome !== 'string') {
    return res.status(400).json({ error: 'nome é obrigatório' });
  }

  const municipio = {
    id: nanoid(),
    nome: nome.trim(),
    created_at: new Date().toISOString()
  };

  try {
    await insertItem('municipios', municipio);
    res.status(201).json(municipio);
  } catch (error) {
    res.status(500).json({ error: 'não foi possível criar o município' });
  }
});

module.exports = router;
