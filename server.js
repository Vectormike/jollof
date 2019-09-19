const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const auth = require('./auth');
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname == '/api/auth/login' && req.method === 'POST') {
    auth.login(req, res);
  } else if (reqUrl.pathname == '/api/auth/register' && req.method === 'POST') {
    auth.register(req, res);
  } else if (reqUrl.pathname == '/' && req.method === 'GET') {
    res.end('Welcome');
  } else {
    res.end('Invalid Endpoint');
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
