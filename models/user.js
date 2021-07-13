const mongoose=require('mongoose');
const globalConstant=require('../utils/globalConstant');

var validateEmail = function(email) {
    var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email)
}
var validateName = function(name){
    return isNaN(parseInt(name,globalConstant.RADIX));
}

const User=new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
        validate:[validateName,'Please enter a valid first name']
    },
    last_name:{
        type:String,
        required:true,
        validate:[validateName,'Please enter a valid last name']
    },
    email:{
        type:String,
        required:true,
        validate:[validateEmail,'Please enter a valid email address'],
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
    },
    roleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Role',
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

module.exports=mongoose.model('User',User);