export const environment = {
  production: true,
  // For GitHub Pages (static hosting), use a CORS proxy service
  // The proxy base URL - the client will construct the full URL
  // Option 1: Use allorigins.win CORS proxy (free, reliable)
  camaraApiUrl: 'allorigins.win',
  // Option 2: Try direct API (if CORS is enabled) - uncomment to test
  // camaraApiUrl: 'https://dadosabertos.camara.leg.br/api/v2',
  // Option 3: Use another CORS proxy
  // camaraApiUrl: 'corsproxy.io'
};
