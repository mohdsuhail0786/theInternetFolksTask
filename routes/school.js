const router=require('express').Router();
const School=require('../models/school')
const Student=require('../models/student')
const apiUtils=require('../utils/apiUtils')
const logger=require('../utils/logger')
const HttpStatus=require('http-status-codes');
const User=require('../models/user');
const verify = require('../middlewares/verify');
const mongoose= require('mongoose')

router.post('/school',verify,(req,res)=>{
    logger.debug('inside add school api')
    const {name,city,state,country} = req.body
    const userId=req.user.userId;
    User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$lookup:{from:"roles",localField:"roleId",foreignField:"_id",as:"roles"}},{$match:{"roles.scopes":{$in:["school-create"]}}}])
    .then((result)=>{
        if(result.length){
            return School.create({name,city,state,country})
        }
        else{
            return Promise.reject(new Error('access-denied, not allowed to perform this action'))
        }
    })
    .then((response)=>{
        logger.debug('School registered successfully');
        res.status(HttpStatus.OK).json(apiUtils.getResponse('true',{data:response}))
    })
    .catch((err)=>{
        logger.debug(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{error:err.message}))
    })
})

router.get('/school',verify,(req,res)=>{
    logger.debug('inside get all schools api')
    const userId=req.user.userId;
    User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$lookup:{from:"roles",localField:"roleId",foreignField:"_id",as:"roles"}},{$match:{"roles.scopes":{$in:["school-get"]}}}])
    .then((result)=>{
        if(result.length){
            return School.find()
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
        res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{error:err.message}))
    })
})

router.get('/school/students',verify,(req,res)=>{
    logger.debug('inside get all students of all schools')
    const userId=req.user.userId;
    User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$lookup:{from:"roles",localField:"roleId",foreignField:"_id",as:"roles"}},{$match:{"roles.scopes":{$in:["school-students"]}}}])
    .then((result)=>{
        if(result.length){
            return School.aggregate([{$lookup:{from:"students",localField:"_id",foreignField:"schoolId",as:"students"}}])
        }
        else{
            return Promise.reject(new Error('access-denied, not allowed to perform this action'))
        }
    })
    .then((result)=>{
        logger.debug('Schools and students fetched')
        res.status(HttpStatus.OK).json(apiUtils.getResponse('true',{data:result}))
    })
    .catch((err)=>{
        logger.error(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{error:err.message}))
    })
})

module.exports=router;