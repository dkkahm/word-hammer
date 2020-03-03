const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/session', { target: 'http://localhost:4000' }),
  );
  app.use(createProxyMiddleware('/doc', { target: 'http://localhost:4000' }));
  app.use(createProxyMiddleware('/auth', { target: 'http://localhost:4000' }));
};
