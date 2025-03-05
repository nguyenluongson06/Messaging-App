const express = require('express');
const router = express.Router();
const { signup, signin, signout } = require('../controllers/authController');
const { findUser } = require('../controllers/findUser');

//TODO: create controllers + route handlers for auths
router.get('/find', findUser);
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);

module.exports = router;
