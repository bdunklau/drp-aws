const http = require('http');

const hostname = '127.0.0.1'; // not used, commented out below
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World<P>This change was made from VSCode connecting directly to the EC2 instance!');
});

server.listen(port/*, hostname*/, () => {
  console.log(`Server running on ${port}/`);
});

