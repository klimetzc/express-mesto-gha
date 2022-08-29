const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    default: 'Жак Ив-Кусто',
    type: String,
    minlength: 2,
    maxlength: 30,
  },

  about: {
    default: 'Исследователь океана',
    type: String,
    minlength: 2,
    maxlength: 30,
  },

  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
});

/**
 *
 * @memberOf User
 */
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new Error('Неправильные почта или пароль'));
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return Promise.reject(new Error('Неправильные почта или пароль'));
          return user;
        });
    });
};

/** @class User */
module.exports = mongoose.model('user', userSchema);
