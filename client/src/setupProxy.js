const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://localhost:4000',
      pathRewrite: {
        '^/api/session': '/session', // rewrite path
        '^/api/doc': '/doc', // rewrite path
      },
    }),
  );
};
