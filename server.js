const http = require('http');
const routes = require('./routes');
const { port, host } = require('./config/config');

const server = http.createServer((req, res) => routes(req, res));

server.listen(port, host, () => {
<<<<<<< HEAD
  console.log(`Server is running.`);
=======
  console.log(`Server running at http://${host}:${port}/`);
>>>>>>> 9298c082fe0198765896acad7bd830748b3b893f
});