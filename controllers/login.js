const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const ConflictError = require('../errors/conflict-error');
const UnathorizedError = require('../errors/unathorized-error');

const SALT_ROUNDS = 10;
const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Email или пароль не могут быть пустыми'));
  }
  UserModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new ForbiddenError('Такого пользователя не существует'));
      }
      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          return next(new UnathorizedError('Email или пароль неверный'));
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        return res.status(200).cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        }).end();
      });
    })
    .catch(() => next(new Error()));
};

const createUser = (req, res, next) => {
  const userData = req.body;

  if (!userData.email || !userData.password) {
    return next(new BadRequestError('Email или пароль не могут быть пустыми'));
  }
  bcrypt.hash(userData.password, SALT_ROUNDS)
    .then((hash) => UserModel.create({ ...userData, password: hash }))
    .then(({ _id }) => res.status(201).send({ id: _id }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Такой пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(new Error());
    });
};

module.exports = {
  createUser,
  login,
};