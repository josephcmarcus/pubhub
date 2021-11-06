const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Pub = require('./models/pub');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
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

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/pubs', async (req, res) => {
    const pubs = await Pub.find({})
    res.render('pubs/index', { pubs })
})

app.get('/pubs/new', (req, res) => {
    res.render('pubs/new')
})

app.get('/error', (req, res) => {
    wazow()
})

app.post('/pubs', async (req, res) => {
    const pub = new Pub(req.body.pub);
    await pub.save();
    res.redirect(`/pubs/${pub._id}`)
})

app.get('/pubs/:id', async (req, res) => {
    const { id } = req.params;
    const pub = await Pub.findById(id);
    res.render('pubs/show', { pub });
})

app.get('/pubs/:id/edit', async (req, res) => {
    const { id } = req.params;
    const pub = await Pub.findById(id);
    res.render('pubs/edit', { pub });
})

app.put('/pubs/:id', async (req, res) => {
    const { id } = req.params;
    const pub = await Pub.findByIdAndUpdate(id, {...req.body.pub});
    res.redirect(`/pubs/${pub._id}`)
})

app.delete('/pubs/:id', async (req, res) => {
    const { id } = req.params;
    await Pub.findByIdAndDelete(id);
    res.redirect('/pubs')
})

// app.use((req, res) => {
//     res.status(404).send('Not Found');
// })

app.use((err, req, res, next) => {
    console.log('*********')
    console.log('**ERROR**')
    console.log('*********')
    next(err)
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})