const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = require('url');
const session = require('express-session');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
const appRoutes = require('./routes')(router);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
/* app.use(
  session({
    secret: 'huhuhu',
  })
); */
app.use(express.static(__dirname));
app.use('/api', appRoutes);

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/redirect', (req, res) => {
  const regex = /\/\//;
  if (req.query.url) {
    let urle = req.query.url;
    let url = decodeURIComponent(urle);
    if (regex.test(urle) && process.argv.slice(2)[0] !== 'unsecure') {
      res.status('400').end('unvalidated redirection is not allowed');
    } else {
      res.redirect(url);
    }
  }
  res.status('400').end('Bad request');
});

mongoose.connect('mongodb://localhost:27017/buggynode', err => {
  if (err) {
    console.log('not connected to the db: ' + err);
  } else {
    console.log('Successfully connected to db');
  }
});

app.listen(port, () => {
  console.log('Running the server on port:' + port);
});
