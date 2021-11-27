const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', catchAsync(async(req, res) => {
  try {
  const { email, username, password } = req.body;
  const user = new User({email, username});
  const registeredUser = await User.register(user, password);
  req.flash('success', 'Welcome to PubHub!');
  res.redirect('/pubs');
  } catch(err) {
    req.flash('error', `${err.message}. Please try again.`)
    res.redirect('/register')
  }
}));

module.exports = router;