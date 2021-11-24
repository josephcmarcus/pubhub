const express = require('express');
const router = express.Router();
const Pub = require('../models/pub');
const { pubSchema } = require('../schemas.js');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const validatePub = (req, res, next) => {
  const {error} = pubSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

router.get('', catchAsync(async (req, res) => {
  const pubs = await Pub.find({})
  res.render('pubs/index', { pubs })
}))

router.get('/new', (req, res) => {
  res.render('pubs/new')
})

router.post('', validatePub, catchAsync(async (req, res) => {
  const pub = new Pub(req.body.pub);
  await pub.save();
  req.flash('success', 'Successfully created a new pub.');
  res.redirect(`/pubs/${pub._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const pub = await Pub.findById(id).populate('reviews')
  if (!pub) {
    req.flash('error', 'Pub could not be found.');
    return res.redirect('/pubs');
  }
  res.render('pubs/show', { pub });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params;
  const pub = await Pub.findById(id);
  if (!pub) {
    req.flash('error', 'Pub could not be found.');
    return res.redirect('/pubs');
  }
  res.render('pubs/edit', { pub });
}))

router.put('/:id', validatePub, catchAsync(async (req, res) => {
  const { id } = req.params;
  const pub = await Pub.findByIdAndUpdate(id, {...req.body.pub});
  req.flash('success', 'Successfully updated pub.');
  res.redirect(`/pubs/${pub._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const pub = await Pub.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted pub.');
  res.redirect('/pubs');
}))

module.exports = router;