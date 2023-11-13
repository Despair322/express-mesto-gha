const UserModel = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const getUsers = (req, res, next) => {
  UserModel.find()
    .then((users) => res.send(users))
    .catch(() => next(new Error()));
};

const getUserById = (req, res, next) => {
  const { id } = req.params;

  UserModel.findById(id)
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Невалидный ID'));
      }
      return next(new Error());
    });
};

const getUser = (req, res, next) => {
  const id = req.user._id;
  UserModel.findById(id)
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Невалидный ID'));
      }
      return next(new Error());
    });
};

const updateUserById = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Невалидный ID'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(new Error());
    });
};

const updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Невалидный ID'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(new Error());
    });
};

module.exports = {
  getUsers,
  getUser,
  getUserById,
  updateUserById,
  updateAvatar,
};
