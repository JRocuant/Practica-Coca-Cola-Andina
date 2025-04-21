const { Router } = require('express');
const router = Router();

const { 
    renderSignUpForm, 
    renderSigninForm, 
    signup, 
    signin, 
    logout,
    olvido 
} = require('../controllers/users.controller')

router.get('/users/signup', renderSignUpForm);

router.post('/users/signup', signup);

router.get('/users/signin', renderSigninForm);

router.post('/users/signin', signin);

router.get('/users/logout', logout);

router.get('/users/olvido', olvido);

module.exports = router;