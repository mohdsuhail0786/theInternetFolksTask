const mongoose=require('mongoose');

const School=new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type: String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        default:Date.now()
    },
    updated:{
        type:Date,
        default:null
    }
})

module.exports=mongoose.model('School',School);