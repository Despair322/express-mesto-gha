const router = require('express').Router();
const {
  createUser, getUsers, getUserById, updateUserById, updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/me', updateUserById);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
