const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { Low, JSONFile } = require('lowdb');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbFile = path.join(dataDir, 'store.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);

const ROOT_MUNICIPIO_ID = 'municipio-root';
const ROOT_USER_ID = 'user-root';

function buildRootMunicipio() {
  return {
    id: ROOT_MUNICIPIO_ID,
    nome: 'Município Root',
    created_at: '2026-03-31T00:00:00.000Z'
  };
}

function buildRootUser() {
  return {
    id: ROOT_USER_ID,
    nome: 'Root',
    email: 'root',
    password: bcrypt.hashSync('root', 10),
    role: 'admin',
    municipio_id: ROOT_MUNICIPIO_ID,
    created_at: '2026-03-31T00:00:00.000Z'
  };
}

const defaultCollections = () => ({
  municipios: [],
  users: [],
  categories: [],
  reports: [],
  reportUpdates: [],
  reportCategories: []
});

async function ensureDb() {
  await db.read();
  if (!db.data) {
    db.data = defaultCollections();
  }

  let mutated = false;
  const defaults = defaultCollections();
  for (const key of Object.keys(defaults)) {
    if (!Array.isArray(db.data[key])) {
      db.data[key] = defaults[key];
      mutated = true;
    }
  }

  if (!db.data.municipios.some((municipio) => municipio.id === ROOT_MUNICIPIO_ID)) {
    db.data.municipios.push(buildRootMunicipio());
    mutated = true;
  }

  if (!db.data.users.some((user) => user.id === ROOT_USER_ID)) {
    db.data.users.push(buildRootUser());
    mutated = true;
  }

  if (mutated) {
    await db.write();
  }
}

async function readCollection(collection) {
  await ensureDb();
  return db.data[collection];
}

async function listCollection(collection, filterFn = null) {
  const items = await readCollection(collection);
  if (!filterFn) return [...items];
  return items.filter(filterFn);
}

async function findById(collection, id) {
  const items = await readCollection(collection);
  return items.find((item) => item.id === id) || null;
}

async function insertItem(collection, item) {
  await ensureDb();
  db.data[collection].push(item);
  await db.write();
  return item;
}

async function updateItem(collection, id, changes) {
  await ensureDb();
  const items = db.data[collection];
  const index = items.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return null;
  }
  const updated = { ...items[index], ...changes };
  items[index] = updated;
  await db.write();
  return updated;
}

async function deleteItem(collection, id) {
  await ensureDb();
  const items = db.data[collection];
  const index = items.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return false;
  }
  items.splice(index, 1);
  await db.write();
  return true;
}

async function replaceReportCategories(reportId, categoriaIds) {
  await ensureDb();
  const entries = db.data.reportCategories;
  db.data.reportCategories = entries.filter((entry) => entry.report_id !== reportId);
  categoriaIds.forEach((categoriaId) => {
    if (!db.data.reportCategories.some((entry) => entry.report_id === reportId && entry.categoria_id === categoriaId)) {
      db.data.reportCategories.push({
        report_id: reportId,
        categoria_id: categoriaId
      });
    }
  });
  await db.write();
}

async function insertReportUpdate(update) {
  await insertItem('reportUpdates', update);
  return update;
}

async function removeReportDependencies(reportId) {
  await ensureDb();
  db.data.reportCategories = db.data.reportCategories.filter((entry) => entry.report_id !== reportId);
  db.data.reportUpdates = db.data.reportUpdates.filter((entry) => entry.report_id !== reportId);
  await db.write();
}

module.exports = {
  ROOT_MUNICIPIO_ID,
  ROOT_USER_ID,
  listCollection,
  findById,
  insertItem,
  updateItem,
  deleteItem,
  replaceReportCategories,
  insertReportUpdate,
  removeReportDependencies
};
