const CardModel = require('../models/card');

const createCard = (req, res) => {
  const id = req.user._id;
  const cardData = req.body;
  CardModel.create({ ...cardData, owner: id }, { runValidators: true })
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
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: `Server Error + ${err}` }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  CardModel.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(204);
    })
    .catch((err) => {
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
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(201).send(card);
    })
    .catch((err) => {
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
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
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
