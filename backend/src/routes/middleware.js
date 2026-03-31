function resolveMunicipioId(req) {
  return (
    req.header('x-municipio-id') ||
    req.query?.municipioId ||
    req.query?.municipio_id ||
    req.body?.municipioId ||
    req.body?.municipio_id ||
    null
  );
}

function requireMunicipioId(req, res, next) {
  const municipioId = resolveMunicipioId(req);
  if (!municipioId) {
    return res.status(400).json({ error: 'municipio_id header/query/body is required' });
  }
  req.municipioId = municipioId;
  next();
}

module.exports = {
  requireMunicipioId,
  resolveMunicipioId
};
