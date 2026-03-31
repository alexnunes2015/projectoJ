const express = require('express');
const { nanoid } = require('nanoid');
const { listCollection, findById, insertReportUpdate } = require('../db');
const { requireMunicipioId } = require('./middleware');
const { reportStatuses } = require('../constants');

const router = express.Router();

router.get('/', requireMunicipioId, async (req, res) => {
  const { report_id } = req.query;
  const municipioId = req.municipioId;
  if (!report_id) {
    return res.status(400).json({ error: 'report_id é obrigatório' });
  }

  const report = await findById('reports', report_id);
  if (!report || report.municipio_id !== municipioId) {
    return res.status(404).json({ error: 'ocorrência não encontrada' });
  }

  try {
    const updates = await listCollection('reportUpdates', (update) => update.report_id === report_id);
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: 'não foi possível listar o histórico' });
  }
});

router.post('/', requireMunicipioId, async (req, res) => {
  const municipioId = req.municipioId;
  const { report_id, status, comentario, updated_by } = req.body;

  if (!report_id || !status) {
    return res.status(400).json({ error: 'report_id e status são obrigatórios' });
  }

  if (!reportStatuses.includes(status)) {
    return res.status(400).json({ error: `status inválido: ${reportStatuses.join(', ')}` });
  }

  const report = await findById('reports', report_id);
  if (!report || report.municipio_id !== municipioId) {
    return res.status(404).json({ error: 'ocorrência não encontrada' });
  }

  const update = {
    id: nanoid(),
    report_id,
    status,
    comentario: comentario || null,
    updated_by: updated_by || null,
    created_at: new Date().toISOString()
  };

  try {
    await insertReportUpdate(update);
    res.status(201).json(update);
  } catch (error) {
    res.status(500).json({ error: 'não foi possível adicionar o histórico' });
  }
});

module.exports = router;
