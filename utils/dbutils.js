require('dotenv').config();
const mongoose=require('mongoose');
const logger = require('./logger');
const url=process.env.URI;

exports.mongoConnect=()=>{
    mongoose.connect(url,{useUnifiedTopology: true, useNewUrlParser: true,useCreateIndex:true})
    .then(()=>{
        logger.info('Connected to mongoDB....')
    })
    .catch(err => {logger.error(err)})
}