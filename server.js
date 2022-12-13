const http = require('http');
const routes = require('./routes');
const { port, host } = require('./config/config');

const server = http.createServer((req, res) => routes(req, res));

server.listen(port, host, () => {
  console.log(`Server is running`);
});