const User = require('./User');
const jwt = require('jsonwebtoken');
const secret = 'harrypotter';

module.exports = function(router) {
  //User Registration Route
  router.post('/users', (req, res) => {
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
      user.save(err => {
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
  router.post('/authenticate', (req, res) => {
    let validPassword;
    User.findOne({ username: req.body.username })
      .select('email username password')
      .exec((err, user) => {
        if (err) throw err;

        if (!user) {
          res.json({ success: false, message: 'Could not authenticate user' });
        } else {
          if (req.body.password) {
            validPassword = user.comparePassword(req.body.password);

            if (!validPassword) {
              res.json({
                success: false,
                message: 'Could not authenticate password',
              });
            } else {
              const token = jwt.sign(
                { username: user.username, email: user.email },
                secret,
                { expiresIn: '1min' }
              );
              console.log({
                success: true,
                message: 'User authenticated',
                token: token,
              });
              res.redirect('/login');
            }
          } else {
            res.json({ success: false, message: 'No password provided' });
          }
        }
      });
  });

  router.use((req, res, next) => {
    const token =
      req.body.token || req.body.query || req.headers['x-access-token'];

    if (token) {
      //verify token
      jwt.verify(token, secret, (err, decoded) => {
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

  router.get('/users', (req, res) => {
    User.find({})
      .then(users => res.send(users))
      .catch(err => res.send(err));
  });
  return router;
};
