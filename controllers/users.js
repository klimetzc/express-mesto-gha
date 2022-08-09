const User = require('../models/user');
const { handleError } = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((e) => {
      handleError(e, res);
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      handleError(e, res);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      handleError(e, res);
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      res.send({ user });
    })
    .catch((e) => {
      handleError(e, res);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      handleError(e, res);
    });
};
