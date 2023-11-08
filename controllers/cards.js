const CardModel = require('../models/card');

const createCard = (req, res) => {
  const owner = req.user._id;
  const cardData = req.body;
  CardModel.create({ ...cardData, owner })
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const getCards = (req, res) => {
  CardModel.find()
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `Server Error + ${err}` }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  console.log(cardId);
  CardModel.findByIdAndDelete(cardId)
    .orFail(new Error('Card not found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Card not found') {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const id = req.user._id;
  CardModel.findByIdAndUpdate(cardId, { $addToSet: { likes: id } }, { new: true })
    .orFail(new Error('Card not found'))
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.message === 'Card not found') {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const id = req.user._id;
  CardModel.findByIdAndUpdate(cardId, { $pull: { likes: id } }, { new: true })
    .orFail(new Error('Card not found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Card not found') {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID' });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
