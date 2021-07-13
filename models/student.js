const mongoose=require('mongoose');

const Student=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    schoolId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'School',
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

module.exports=mongoose.model('Student',Student);