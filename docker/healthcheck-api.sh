#!/bin/sh
set -e
node -e "
const http = require('http');
http
  .get('http://127.0.0.1:3000/health', (res) => {
    res.resume();
    process.exit(res.statusCode === 200 ? 0 : 1);
  })
  .on('error', () => {
    process.exit(1);
  });
"
