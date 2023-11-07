const router = require('express').Router();
const usersRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => res.status(404).send({ message: 'No such route' }));

module.exports = router;
