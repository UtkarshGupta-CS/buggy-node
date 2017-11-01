const User = require('./User');
const jwt = require('jsonwebtoken');
const secret = 'harrypotter';
const path = require('path');

module.exports = function(router) {
  //User Registration Route
  router.post('/users', function(req, res) {
    console.log(req.body);
    const user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if (
      req.body.username === null ||
      req.body.username === '' ||
      req.body.password === null ||
      req.body.password === '' ||
      req.body.email === null ||
      req.body.email === ''
    ) {
      res.json({
        success: false,
        message: 'Ensure that username,email or password are provided',
      });
    } else {
      user.save(function(err) {
        if (err) {
          res.json({
            success: false,
            message: err,
          });
        } else {
          console.log({ success: true, message: 'User Created' });
          res.redirect('/login');
        }
      });
    }
  });
  //User Login Route
  router.post('/authenticate', function(req, res) {
    User.findOne({ username: req.body.username })
      .select('email username password')
      .exec(function(err, user) {
        if (err) throw err;

        if (!user) {
          res.json({ success: false, message: 'Could not authenticate user' });
        } else if (user) {
          if (req.body.password) {
            const validPassword = user.comparePassword(req.body.password);
          } else {
            res.json({ success: false, message: 'No password provided' });
          }
          if (!validPassword) {
            res.json({
              success: false,
              message: 'Could not authenticate password',
            });
          } else {
            const token = jwt.sign(
              { username: user.username, email: user.email },
              secret,
              { expiresIn: '24h' }
            );
            // process.env['JWT'] = token;
            console.log({
              success: true,
              message: 'User authenticated',
              token: token,
            });
            res.redirect('/login');
          }
        }
      });
  });

  router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/login.html'));
  });

  router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
  });

  router.get('logout', (req, res) => {
    res.sendFile(path.join(__dirname + '/login.html'));
  });

  router.get('/redirect', (req, res) => {
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
  router.use(function(req, res, next) {
    const token =
      req.body.token || req.body.query || req.headers['x-access-token'];

    if (token) {
      //verify token
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({ success: false, message: 'token invalid' });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.json({ success: false, message: 'no token provided' });
    }
  });

  return router;
};
