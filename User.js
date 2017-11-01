const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
});

//encrption of password using bcrypt-nodejs
UserSchema.pre('save', next => {
  const user = this;
  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) return next();
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = password => {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
