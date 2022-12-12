const http = require('http');
const routes = require('./routes');

const hostname = '127.0.0.1'; // - optional
const port = 3000;

const server = http.createServer((req, res) => routes(req, res));

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});