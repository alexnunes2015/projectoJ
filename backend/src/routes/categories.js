const express = require('express');
const { nanoid } = require('nanoid');
const { listCollection, insertItem, findById, updateItem, deleteItem } = require('../db');
const { requireMunicipioId } = require('./middleware');

const router = express.Router();

router.get('/', requireMunicipioId, async (req, res) => {
  const municipioId = req.municipioId;
  try {
    const categories = await listCollection('categories', (cat) => cat.municipio_id === municipioId);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'não foi possível listar as categorias' });
  }
});

router.post('/', requireMunicipioId, async (req, res) => {
  const municipioId = req.municipioId;
  const { nome } = req.body;
  if (!nome || typeof nome !== 'string') {
    return res.status(400).json({ error: 'nome é obrigatório' });
  }

  const category = {
    id: nanoid(),
    nome: nome.trim(),
    municipio_id: municipioId
  };

  try {
    await insertItem('categories', category);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'não foi possível criar a categoria' });
  }
});

router.patch('/:id', requireMunicipioId, async (req, res) => {
  const municipioId = req.municipioId;
  const category = await findById('categories', req.params.id);
  if (!category || category.municipio_id !== municipioId) {
    return res.status(404).json({ error: 'categoria não encontrada' });
  }

  if (!req.body.nome) {
    return res.status(400).json({ error: 'nome é obrigatório' });
  }

  try {
    const updated = await updateItem('categories', category.id, { nome: String(req.body.nome).trim() });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'não foi possível atualizar a categoria' });
  }
});

router.delete('/:id', requireMunicipioId, async (req, res) => {
  const municipioId = req.municipioId;
  const category = await findById('categories', req.params.id);
  if (!category || category.municipio_id !== municipioId) {
    return res.status(404).json({ error: 'categoria não encontrada' });
  }

  try {
    await deleteItem('categories', category.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'não foi possível remover a categoria' });
  }
});

module.exports = router;
