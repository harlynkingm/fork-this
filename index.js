const express = require('express')
const app = express()

app.use(express.static('client'))

app.listen(8222, function () {
  console.log('listening on port 8222!');
});

