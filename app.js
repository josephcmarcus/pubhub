const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const pubRoutes = require('./routes/pubs')
const reviewRoutes = require('./routes/reviews');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');

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

app.use('/pubs', pubRoutes);
app.use('/pubs/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

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