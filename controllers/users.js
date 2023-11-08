const UserModel = require('../models/user');

const createUser = (req, res) => {
  const userData = req.body;
  return UserModel.create(userData)
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const getUsers = (req, res) => {
  UserModel.find()
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `Server Error + ${err}` }));
};

const getUserById = (req, res) => {
  const { id } = req.params;

  UserModel.findById(id)
    .orFail(new Error('User not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'User not found') {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const updateUserById = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('User not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'User not found') {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const updateAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('User not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'User not found') {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateAvatar,
};
