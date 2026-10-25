const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const ROUTES = {
  '/': { file: path.join(__dirname, 'index.html'), type: 'text/html; charset=utf-8' },
  '/index.html': { file: path.join(__dirname, 'index.html'), type: 'text/html; charset=utf-8' },
  '/cv': { file: path.join(__dirname, 'cv.html'), type: 'text/html; charset=utf-8' },
  '/cv.html': { file: path.join(__dirname, 'cv.html'), type: 'text/html; charset=utf-8' },
  '/styles.css': { file: path.join(__dirname, 'styles.css'), type: 'text/css; charset=utf-8' },
  '/script.js': { file: path.join(__dirname, 'script.js'), type: 'application/javascript; charset=utf-8' },
  '/app.js': { file: path.join(__dirname, 'script.js'), type: 'application/javascript; charset=utf-8' },
  '/favicon.svg': { file: path.join(__dirname, 'favicon.svg'), type: 'image/svg+xml' }
};

const server = http.createServer((req, res) => {
  const safeUrl = (req.url || '/').split('?')[0];
  const route = ROUTES[safeUrl];

  if (!route) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  fs.readFile(route.file, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': route.type,
      'Cache-Control': 'public, max-age=0, must-revalidate'
    });
    res.end(content);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server attivo su http://localhost:${PORT}`);
  });
}

module.exports = server;
