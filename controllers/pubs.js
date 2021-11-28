const Pub = require('../models/pub');

module.exports.index = async (req, res) => {
  const pubs = await Pub.find({})
  res.render('pubs/index', { pubs })
};

module.exports.renderNewForm = (req, res) => {
    res.render('pubs/new')
};

module.exports.createPub = async (req, res) => {
    const pub = new Pub(req.body.pub);
    pub.author = req.user._id;
    await pub.save();
    req.flash('success', 'Successfully created a new pub.');
    res.redirect(`/pubs/${pub._id}`);
};

module.exports.showPub = async (req, res) => {
    const { id } = req.params;
    const pub = await Pub.findById(id).populate({
      path: 'reviews', populate: {
        path: 'author'
      }
    }).populate('author')
    if (!pub) {
      req.flash('error', 'Pub could not be found.');
      return res.redirect('/pubs');
    }
    res.render('pubs/show', { pub });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const pub = await Pub.findById(id);
    if (!pub) {
      req.flash('error', 'Pub could not be found.');
      return res.redirect('/pubs');
    }
    res.render('pubs/edit', { pub });
};

module.exports.editPub = async (req, res) => {
    const { id } = req.params;
    const pub = await Pub.findByIdAndUpdate(id, {...req.body.pub});
    req.flash('success', 'Successfully updated pub.');
    res.redirect(`/pubs/${pub._id}`)
};

module.exports.deletePub = async (req, res) => {
    const { id } = req.params;
    const pub = await Pub.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted pub.');
    res.redirect('/pubs');
};