const express = require('express')
const app = express()

const ROOT_DIR = process.env.NODE_ENV == 'production' ? 'build' : 'client'

app.use(express.static(ROOT_DIR))

app.listen(8222, function () {
  console.log('serving ' + ROOT_DIR + ' on port 8222!');
});

