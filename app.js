const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Pub = require('./models/pub');
const Review = require('./models/review');
const pubRoutes = require('./routes/pubs')
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {pubSchema, reviewSchema} = require('./schemas');

// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

mongoose.connect('mongodb://localhost:27017/pubhub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({default: true}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.engine('ejs', ejsMate);

const validatePub = (req, res, next) => {
    const pubSchema = Joi.object({
        pub: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            location: Joi.string().required(),
            image: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    })
    const {error} = pubSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.use('/routertest', pubRoutes);

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/pubs', catchAsync(async (req, res) => {
    const pubs = await Pub.find({})
    res.render('pubs/index', { pubs })
}))

app.get('/pubs/new', (req, res) => {
    res.render('pubs/new')
})

app.post('/pubs', validatePub, catchAsync(async (req, res) => {
    const pub = new Pub(req.body.pub);
    await pub.save();
    res.redirect(`/pubs/${pub._id}`)
}))

app.get('/pubs/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const pub = await Pub.findById(id).populate('reviews');
    res.render('pubs/show', { pub });
}))

app.get('/pubs/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const pub = await Pub.findById(id);
    res.render('pubs/edit', { pub });
}))

app.put('/pubs/:id', validatePub, catchAsync(async (req, res) => {
    const { id } = req.params;
    const pub = await Pub.findByIdAndUpdate(id, {...req.body.pub});
    res.redirect(`/pubs/${pub._id}`)
}))

app.delete('/pubs/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const pub = await Pub.findByIdAndDelete(id);
    res.redirect('/pubs');
}))

app.post('/pubs/:id/reviews', validateReview, catchAsync(async(req, res) => {
    const { id } = req.params;
    const pub = await Pub.findById(id);
    const review = new Review(req.body.review);
    pub.reviews.push(review);
    await review.save();
    await pub.save();
    console.log(review);
    res.redirect(`/pubs/${pub._id}`);
}))

app.delete('/pubs/:id/reviews/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    const pub = await Pub.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/pubs/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no! Something went wrong.';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})