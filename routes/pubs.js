const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Pub = require('../models/pub');
const { pubSchema } = require('../schemas.js');

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
  res.redirect(`/pubs/${pub._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const pub = await Pub.findById(id).populate('reviews');
  res.render('pubs/show', { pub });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params;
  const pub = await Pub.findById(id);
  res.render('pubs/edit', { pub });
}))

router.put('/:id', validatePub, catchAsync(async (req, res) => {
  const { id } = req.params;
  const pub = await Pub.findByIdAndUpdate(id, {...req.body.pub});
  res.redirect(`/pubs/${pub._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const pub = await Pub.findByIdAndDelete(id);
  res.redirect('/pubs');
}))

module.exports = router;