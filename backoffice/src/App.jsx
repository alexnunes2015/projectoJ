import { useEffect, useState } from 'react';
import {
  fetchCategories,
  fetchHealth,
  fetchMunicipios,
  fetchReports,
  fetchUsers,
  loginBackoffice
} from './api';

const emptyLogin = {
  municipioId: '',
  email: '',
  password: ''
};

function StatCard({ label, value }) {
  return (
    <article className="metric-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </article>
  );
}

function App() {
  const [municipios, setMunicipios] = useState([]);
  const [login, setLogin] = useState(emptyLogin);
  const [session, setSession] = useState(null);
  const [dashboard, setDashboard] = useState({
    health: null,
    reports: [],
    users: [],
    categories: []
  });
  const [bootError, setBootError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadMunicipios() {
    setLoading(true);
    setBootError('');

    try {
      const [health, municipioList] = await Promise.all([
        fetchHealth(),
        fetchMunicipios()
      ]);

      setDashboard((current) => ({ ...current, health }));
      setMunicipios(municipioList);
      setLogin((current) => ({
        ...current,
        municipioId: current.municipioId || municipioList[0]?.id || ''
      }));
    } catch (error) {
      setBootError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadDashboard(municipioId) {
    const [reports, users, categories] = await Promise.all([
      fetchReports(municipioId),
      fetchUsers(municipioId),
      fetchCategories(municipioId)
    ]);

    setDashboard((current) => ({
      ...current,
      reports,
      users,
      categories
    }));
  }

  useEffect(() => {
    loadMunicipios();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setSubmitting(true);
    setLoginError('');

    try {
      const result = await loginBackoffice(login);
      setSession(result);
      await loadDashboard(login.municipioId);
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  const selectedMunicipio =
    municipios.find((municipio) => municipio.id === login.municipioId) || null;
  const shouldShowMunicipioField = municipios.length > 1;
  const pendingReports = dashboard.reports.filter((report) => report.status === 'pendente').length;
  const progressReports = dashboard.reports.filter((report) => report.status === 'em_progresso').length;
  const resolvedReports = dashboard.reports.filter((report) => report.status === 'resolvido').length;

  const reportRows = dashboard.reports.map((report, index) => ({
    id: report.id || `${index + 1}`,
    categoria: report.categorias?.[0]?.nome || 'Sem categoria',
    descricao: report.descricao || 'Sem descrição',
    localizacao:
      report.latitude !== null && report.longitude !== null
        ? `${report.latitude}, ${report.longitude}`
        : 'Sem localização',
    estado: report.status
  }));

  const navItems = [
    'Ocorrêntralo',
    'Ocorrências',
    'Melhorias',
    'Configurações'
  ];

  function formatStatusLabel(status) {
    if (status === 'em_progresso') return 'Em Resolução';
    if (status === 'resolvido') return 'Concluído';
    return 'Pendente';
  }

  if (!session) {
    return (
      <div className="login-screen">
        <header className="login-topbar">
          <div className="login-brand">O omeumunicipe</div>
        </header>

        <main className="login-main">
          <section className="login-card">
            <h1>Login do Backoffice</h1>

            <form className="login-form" onSubmit={handleLogin}>
              {shouldShowMunicipioField ? (
                <label className="field">
                  <span>Município</span>
                  <select
                    value={login.municipioId}
                    onChange={(event) =>
                      setLogin((current) => ({ ...current, municipioId: event.target.value }))
                    }
                  >
                    <option value="">Seleciona um município</option>
                    {municipios.map((municipio) => (
                      <option key={municipio.id} value={municipio.id}>
                        {municipio.nome}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <label className="field">
                <span>Email</span>
                <div className="input-shell">
                  <span className="input-icon" aria-hidden="true">✉</span>
                  <input
                    type="text"
                    value={login.email}
                    onChange={(event) =>
                      setLogin((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="Email"
                  />
                </div>
              </label>

              <label className="field">
                <span>Palavra-passe</span>
                <div className="input-shell">
                  <span className="input-icon" aria-hidden="true">🔒</span>
                  <input
                    type="password"
                    value={login.password}
                    onChange={(event) =>
                      setLogin((current) => ({ ...current, password: event.target.value }))
                    }
                    placeholder="Palavra-passe"
                  />
                </div>
              </label>

              <button
                className="button button--login"
                type="submit"
                disabled={submitting || !login.municipioId}
              >
                {submitting ? 'A entrar...' : 'Entrar'}
              </button>

              <button className="login-link" type="button">
                Esqueceste-te a palavra-passe?
              </button>

              {loginError ? <p className="message message--error">{loginError}</p> : null}
              {bootError ? <p className="message message--error">{bootError}</p> : null}
              {loading ? <p className="message">A carregar...</p> : null}
            </form>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <header className="app-topbar">
        <div className="app-logo">
          <span className="app-logo__mark">◯</span>
          <span className="app-logo__text">omeumunicipe</span>
        </div>

        <div className="app-topbar__actions">
          <span className="topbar-icon">🔔</span>
          <span className="topbar-icon">👤</span>
          <span className="topbar-icon">⚙</span>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                className={`sidebar-link${item === 'Ocorrências' ? ' sidebar-link--active' : ''}`}
              >
                <span className="sidebar-link__icon">⬢</span>
                <span>{item}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1>Gestão de Ocorrências</h1>
          </div>

          <section className="metrics-row">
            <StatCard label="Pendentes" value={pendingReports} />
            <StatCard label="Em Resolução" value={progressReports} />
            <StatCard label="Concluídas" value={resolvedReports} />
          </section>

          <section className="table-panel">
            {reportRows.length === 0 ? (
              <div className="empty-state empty-state--table">
                <h3>Sem ocorrências</h3>
                <p>
                  {selectedMunicipio?.nome || 'Município'} · API {dashboard.health?.status || 'indisponível'} ·{' '}
                  {session.user.nome}
                </p>
              </div>
            ) : (
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Categoria</th>
                    <th>Descrição</th>
                    <th>Localização</th>
                    <th>Estado</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {reportRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.categoria}</td>
                      <td>{row.descricao}</td>
                      <td>{row.localizacao}</td>
                      <td>
                        <span className={`badge badge--${row.estado}`}>
                          {formatStatusLabel(row.estado)}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button type="button" className="icon-button" aria-label="Editar">
                            ✎
                          </button>
                          <button type="button" className="icon-button" aria-label="Ver">
                            ◫
                          </button>
                          <button type="button" className="icon-button" aria-label="Remover">
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
