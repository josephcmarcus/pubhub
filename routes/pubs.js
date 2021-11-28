const express = require('express');
const router = express.Router();
const pubs = require('../controllers/pubs');
const { pubSchema } = require('../schemas.js');
const { isLoggedIn, validatePub, isAuthor } = require('../utils/middleware');
const catchAsync = require('../utils/catchAsync');
const { route } = require('./reviews');

router.route('/')
  .get(catchAsync(pubs.index))
  .post(validatePub, isLoggedIn, catchAsync(pubs.createPub));

  router.get('/new', isLoggedIn, pubs.renderNewForm);

router.route('/:id')
  .get(catchAsync(pubs.showPub))
  .put(validatePub, isLoggedIn, isAuthor, catchAsync(pubs.editPub))
  .delete(isLoggedIn, isAuthor, catchAsync(pubs.deletePub));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(pubs.renderEditForm));

module.exports = router;