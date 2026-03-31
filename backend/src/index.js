const express = require('express');
const cors = require('cors');
const reportsRouter = require('./routes/reports');
const municipiosRouter = require('./routes/municipios');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const reportUpdatesRouter = require('./routes/reportUpdates');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({
    name: 'project-backend',
    status: 'ok',
    docs: {
      health: '/health',
      reports: '/api/reports',
      municipios: '/api/municipios',
      users: '/api/users',
      categories: '/api/categories',
      reportUpdates: '/api/report-updates'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/municipios', municipiosRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/report-updates', reportUpdatesRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
