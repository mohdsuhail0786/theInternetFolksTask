const mongoose = require("mongoose");

const Role=new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique:true
    },
    scopes:{
        type: Array,
        required: true,
    },
    created:{
        type: Date,
        default: Date.now()
    },
    updated:{
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('Role',Role);