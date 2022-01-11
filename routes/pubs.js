const express = require('express');
const router = express.Router();
const pubs = require('../controllers/pubs');
const { pubSchema } = require('../schemas.js');
const { isLoggedIn, validatePub, isAuthor } = require('../utils/middleware');
const catchAsync = require('../utils/catchAsync');
const { route } = require('./reviews');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
  .get(catchAsync(pubs.index))
  .post(isLoggedIn, upload.array('images'), validatePub, catchAsync(pubs.createPub));

  router.get('/new', isLoggedIn, pubs.renderNewForm);

router.route('/:id')
  .get(catchAsync(pubs.showPub))
  .put(isLoggedIn, isAuthor, upload.array('images'), validatePub, catchAsync(pubs.editPub))
  .delete(isLoggedIn, isAuthor, catchAsync(pubs.deletePub));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(pubs.renderEditForm));

module.exports = router;