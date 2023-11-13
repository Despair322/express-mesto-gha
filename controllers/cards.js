const CardModel = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const cardData = req.body;
  CardModel.create({ ...cardData, owner })
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(new Error());
    });
};

const getCards = (req, res, next) => {
  CardModel.find()
    .then((cards) => res.send(cards))
    .catch(() => next(new Error()));
};

const deleteCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  CardModel.findById(cardId)
    .orFail(() => next(new NotFoundError('Карточка не найдена')))
    .then((card) => {
      if (card.owner.toString() !== owner.toString()) {
        return next(new ForbiddenError('Попытка удаления чужой карточки'));
      }
      CardModel.findByIdAndDelete(cardId)
        .orFail(() => next(new NotFoundError('Карточка не найдена')))
        .then((deletedCard) => res.send(deletedCard));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Невалидный ID'));
      }
      return next(new Error());
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const id = req.user._id;
  CardModel.findByIdAndUpdate(cardId, { $addToSet: { likes: id } }, { new: true })
    .orFail(() => next(new NotFoundError('Карточка не найдена')))
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Невалидный ID'));
      }
      return next(new Error());
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const id = req.user._id;
  CardModel.findByIdAndUpdate(cardId, { $pull: { likes: id } }, { new: true })
    .orFail(() => next(new NotFoundError('Карточка не найдена')))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Невалидный ID'));
      }
      return next(new Error());
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
