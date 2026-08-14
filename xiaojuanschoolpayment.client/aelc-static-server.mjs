import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve('dist/xiaojuanschoolpayment.client/browser');
const port = Number(process.env.PORT || 44410);

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
]);

function sendFile(response, filePath) {
  const type = contentTypes.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream';
  response.writeHead(200, { 'Content-Type': type });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url || '/', `http://${request.headers.host}`).pathname);
  const normalized = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(root, normalized);

  if (filePath.startsWith(root) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    sendFile(response, filePath);
    return;
  }

  sendFile(response, path.join(root, 'index.html'));
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Static server listening on http://127.0.0.1:${port}`);
});
