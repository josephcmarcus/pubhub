const mongoose = require('mongoose');
const path = require('path');
const cities = require('./cities');
const imagesPool = require('./imagesPool')
const {places, descriptors} = require('./seedHelpers');
const Pub = require('../models/pub');

mongoose.connect('mongodb://localhost:27017/pubhub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Pub.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random15 = Math.floor(Math.random() * 15);
        const price = Math.floor(Math.random() * 5) + 10;
        const pub = new Pub({
            author: '628e921004fa3c453286001e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price: `${price}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [{url: `${imagesPool[random15].url}`, filename: `${imagesPool[random15].filename}`}],
        })
        await pub.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});