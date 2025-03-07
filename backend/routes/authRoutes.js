const router = require('express').Router();
const { userRegister, userLogin, userLogout } = require('../controllers/authControllers');

router.post('/signup', userRegister);
router.post('/signin', userLogin);
router.post('/signout', userLogout);

module.exports = router;