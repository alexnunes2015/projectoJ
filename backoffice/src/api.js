const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

async function request(path, options = {}) {
  const response = await fetch(path, options);
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'error' in payload
        ? payload.error
        : 'pedido falhou';
    throw new Error(message);
  }

  return payload;
}

export async function fetchMunicipios() {
  return request('/api/municipios');
}

export async function createMunicipio(nome) {
  return request('/api/municipios', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ nome })
  });
}

export async function loginBackoffice({ municipioId, email, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: {
      ...JSON_HEADERS,
      'x-municipio-id': municipioId
    },
    body: JSON.stringify({ email, password })
  });
}

export async function fetchUsers(municipioId) {
  return request('/api/users', {
    headers: {
      'x-municipio-id': municipioId
    }
  });
}

export async function fetchCategories(municipioId) {
  return request('/api/categories', {
    headers: {
      'x-municipio-id': municipioId
    }
  });
}

export async function fetchReports(municipioId) {
  return request('/api/reports', {
    headers: {
      'x-municipio-id': municipioId
    }
  });
}

export async function fetchHealth() {
  return request('/health');
}
