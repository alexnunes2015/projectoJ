const express = require('express');
const { nanoid } = require('nanoid');
const {
  listCollection,
  findById,
  insertItem,
  updateItem,
  deleteItem,
  replaceReportCategories,
  insertReportUpdate,
  removeReportDependencies
} = require('../db');
const { requireMunicipioId } = require('./middleware');
const { reportStatuses } = require('../constants');

const router = express.Router();

function parseDecimal(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function buildCategoryLookup(reportCategories) {
  const lookup = new Map();
  reportCategories.forEach((entry) => {
    const list = lookup.get(entry.report_id) || [];
    list.push(entry.categoria_id);
    lookup.set(entry.report_id, list);
  });
  return lookup;
}

function buildUpdatesLookup(updates) {
  const lookup = new Map();
  updates.forEach((entry) => {
    const list = lookup.get(entry.report_id) || [];
    list.push(entry);
    lookup.set(entry.report_id, list);
  });
  return lookup;
}

function formatReport(report, lookup, categoryMap, updatesLookup) {
  const categoryIds = lookup.get(report.id) || [];
  const categories = categoryIds
    .map((id) => categoryMap.get(id))
    .filter((cat) => cat);
  return {
    ...report,
    categorias: categories,
    updates: updatesLookup.get(report.id) || []
  };
}

async function resolveCategorias(categoriaIds, municipioId) {
  if (!Array.isArray(categoriaIds)) {
    return [];
  }
  const available = await listCollection('categories', (cat) => cat.municipio_id === municipioId);
  const allowedSet = new Set(available.map((cat) => cat.id));
  const seen = new Set();
  return categoriaIds
    .map((id) => (id ? String(id).trim() : null))
    .filter((id) => id && allowedSet.has(id) && !seen.has(id))
    .map((id) => {
      seen.add(id);
      return id;
    });
}

async function enrichReports(reports, municipioId) {
  const [categories, reportCategories, updates] = await Promise.all([
    listCollection('categories', (cat) => cat.municipio_id === municipioId),
    listCollection('reportCategories'),
    listCollection('reportUpdates')
  ]);

  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));
  const categoryLookup = buildCategoryLookup(reportCategories);
  const updatesLookup = buildUpdatesLookup(updates);

  return reports.map((report) => formatReport(report, categoryLookup, categoryMap, updatesLookup));
}

router.get('/', requireMunicipioId, async (req, res) => {
  try {
    const municipioId = req.municipioId;
    const { status, user_id, categoria_id, from, to } = req.query;
    let reports = await listCollection('reports', (report) => report.municipio_id === municipioId);

    if (status) {
      reports = reports.filter((report) => report.status === status);
    }
    if (user_id) {
      reports = reports.filter((report) => report.user_id === user_id);
    }
    if (from) {
      const fromDate = new Date(from);
      if (Number.isFinite(fromDate.getTime())) {
        reports = reports.filter((report) => new Date(report.created_at) >= fromDate);
      }
    }
    if (to) {
      const toDate = new Date(to);
      if (Number.isFinite(toDate.getTime())) {
        reports = reports.filter((report) => new Date(report.created_at) <= toDate);
      }
    }

    const enriched = await enrichReports(reports, municipioId);

    if (categoria_id) {
      const filtered = enriched.filter((report) =>
        report.categorias.some((cat) => cat.id === categoria_id)
      );
      return res.json(filtered);
    }

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: 'não foi possível listar as ocorrências' });
  }
});

router.get('/:id', requireMunicipioId, async (req, res) => {
  try {
    const municipioId = req.municipioId;
    const report = await findById('reports', req.params.id);
    if (!report || report.municipio_id !== municipioId) {
      return res.status(404).json({ error: 'ocorrência não encontrada' });
    }
    const [enriched] = await enrichReports([report], municipioId);
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: 'não foi possível carregar a ocorrência' });
  }
});

router.post('/', requireMunicipioId, async (req, res) => {
  const { titulo, descricao, imagem_url, latitude, longitude, status, user_id, categorias } = req.body;
  const municipioId = req.municipioId;

  if (!descricao || typeof descricao !== 'string') {
    return res.status(400).json({ error: 'descricao é obrigatória' });
  }

  const now = new Date().toISOString();
  const report = {
    id: nanoid(),
    titulo: titulo ? String(titulo).trim() : null,
    descricao: descricao.trim(),
    imagem_url: imagem_url || null,
    latitude: parseDecimal(latitude),
    longitude: parseDecimal(longitude),
    status: reportStatuses.includes(status) ? status : 'pendente',
    municipio_id: municipioId,
    user_id: user_id || null,
    created_at: now,
    updated_at: now
  };

  try {
    await insertItem('reports', report);
    const validCategorias = await resolveCategorias(categorias, municipioId);
    await replaceReportCategories(report.id, validCategorias);
    const [enriched] = await enrichReports([report], municipioId);
    res.status(201).json(enriched);
  } catch (error) {
    res.status(500).json({ error: 'não foi possível criar a ocorrência' });
  }
});

router.patch('/:id', requireMunicipioId, async (req, res) => {
  const municipioId = req.municipioId;
  const report = await findById('reports', req.params.id);
  if (!report || report.municipio_id !== municipioId) {
    return res.status(404).json({ error: 'ocorrência não encontrada' });
  }

  const allowedFields = [
    'titulo',
    'descricao',
    'imagem_url',
    'latitude',
    'longitude',
    'status',
    'user_id'
  ];
  const changes = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (['latitude', 'longitude'].includes(field)) {
        changes[field] = parseDecimal(req.body[field]);
      } else {
        changes[field] = req.body[field];
      }
    }
  });

  if (changes.status && !reportStatuses.includes(changes.status)) {
    return res.status(400).json({ error: `status deve ser um dos: ${reportStatuses.join(', ')}` });
  }

  if (Object.keys(changes).length === 0 && !Array.isArray(req.body.categorias)) {
    return res.status(400).json({ error: 'nenhum campo válido foi enviado' });
  }

  changes.updated_at = new Date().toISOString();
  try {
    const updated = await updateItem('reports', report.id, changes);
    if (Array.isArray(req.body.categorias)) {
      const validCategorias = await resolveCategorias(req.body.categorias, municipioId);
      await replaceReportCategories(report.id, validCategorias);
    }

    if (changes.status && changes.status !== report.status) {
      await insertReportUpdate({
        id: nanoid(),
        report_id: report.id,
        status: changes.status,
        comentario: req.body.comentario || null,
        updated_by: req.body.updated_by || null,
        created_at: new Date().toISOString()
      });
    }

    const [enriched] = await enrichReports([updated], municipioId);
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: 'não foi possível atualizar a ocorrência' });
  }
});

router.delete('/:id', requireMunicipioId, async (req, res) => {
  const municipioId = req.municipioId;
  const report = await findById('reports', req.params.id);
  if (!report || report.municipio_id !== municipioId) {
    return res.status(404).json({ error: 'ocorrência não encontrada' });
  }

  try {
    await deleteItem('reports', report.id);
    await removeReportDependencies(report.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'não foi possível remover a ocorrência' });
  }
});

module.exports = router;
