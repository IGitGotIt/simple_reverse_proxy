const express = require('express');
const proxy = require('http-proxy-middleware');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');






const otProxy = proxy({
  target: 'https://ot-test-reverse-proxy.herokuapp.com',
  pathRewrite: {
        [`^/json_placeholder/abc/123`]: '',
    },
  changeOrigin: true,

  
  ws: true,
});

const app = express()
const PORT = 3000;
const USE_SSL = 0


app.use('/json_placeholder',  otProxy);

let server;

if (!USE_SSL) {
  console.log("Starting over HTTP");
  server = http.createServer(app);
}
else {
  console.log("Starting over HTTPS");
  const key = fs.readFileSync(path.join(__dirname, 'selfsigned.key'));
  const cert = fs.readFileSync(path.join(__dirname, 'selfsigned.crt'));
  const options = {
    key: key,
    cert: cert
  };
  server = https.createServer(options, app);
}
server.listen(PORT, () => console.log(`Reverse proxy started.`))
process.once('SIGINT', () => { server.close(); });

