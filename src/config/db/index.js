const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.URI_MONGODB_CLOUD;

const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose
        .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Connected to MongoDB Atlas');
        })
        .catch((error) => {
            console.log(error);
        });
};

module.exports = { connect };
