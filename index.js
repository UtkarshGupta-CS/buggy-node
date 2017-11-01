const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = require('url');
const session = require('express-session');
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
/* app.use(session({
  secret: process.env.JWT,
  key: 'sid',
})); */
app.use(express.static(__dirname));
app.use('/api', appRoutes);

mongoose.connect('mongodb://localhost:27017/buggynode', err => {
  if (err) {
    console.log('not connected to the db: ' + err);
  } else {
    console.log('Successfully connected to db');
  }
});

// if(url.parse(req.url))
app.listen(port, () => {
  console.log('Running the server on port:' + port);
});
// console.log(process.argv.slice(2));
