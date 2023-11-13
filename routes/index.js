const router = require('express').Router();
const { errors } = require('celebrate');
const usersRouter = require('./users');
const cardRouter = require('./cards');
const loginRouter = require('./login');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/error-handler');

router.use('/', loginRouter);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => res.status(404).send({ message: 'No such route' }));
router.use(errors());
router.use(errorHandler);

module.exports = router;
