const router=require('express').Router();
const Student=require('../models/student')
const User=require('../models/user')
const School=require('../models/school')
const apiUtils=require('../utils/apiUtils')
const logger=require('../utils/logger')
const HttpStatus=require('http-status-codes');
const mongoose=require('mongoose')
const verify=require('../middlewares/verify')

router.post('/student',verify,(req,res)=>{
    logger.debug('inside add student api')
    const {name,userId,schoolId} = req.body
    const usrId=req.user.userId;
    User.aggregate([{$match:{_id:mongoose.Types.ObjectId(usrId)}},{$lookup:{from:"roles",localField:"roleId",foreignField:"_id",as:"roles"}},{$match:{"roles.scopes":{$in:["student-create"]}}}])
    .then((result)=>{
        logger.debug('Data fetched successfully')
        if(result.length){
            return User.findById(userId)
        }
        else{
            return Promise.reject(new Error('access-denied, not allowed to perform this action'))
        }
    })
    .then((user)=>{
        if(user){
            return School.findById(schoolId)
        }
        else{
            return Promise.reject(new Error('User not found'))
        }
    })
    .then((school)=>{
        if(school){
            return Student.create({name,userId,schoolId})
        }
        else{
            return Promise.reject(new Error('school not found'))
        }
    })
    .then((response)=>{
        logger.debug('Student registered successfully');
        res.status(HttpStatus.OK).json(apiUtils.getResponse('true',{data:response}))
    })
    .catch((err)=>{
        logger.debug(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{errors:[{message:err.message}]}))
    })
})

router.get('/student',verify,(req,res)=>{
    logger.debug('inside get all students api')
    const usrId=req.user.userId;
    User.aggregate([{$match:{_id:mongoose.Types.ObjectId(usrId)}},{$lookup:{from:"roles",localField:"roleId",foreignField:"_id",as:"roles"}},{$match:{"roles.scopes":{$in:["student-get"]}}}])
    .then((result)=>{
        logger.debug('Data fetched successfully')
        if(result.length){
            return Student.find()
        }
        else{
            return Promise.reject(new Error('access-denied, not allowed to perform this action'))
        }
    })
    .then((response)=>{
        logger.debug('Data fetched successfully')
        res.status(HttpStatus.OK).json(apiUtils.getResponse('true',{data:response}))
    })
    .catch((err)=>{
        logger.debug(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{errors:[{message:err.message}]}))
    })
})

module.exports=router;