const router=require('express').Router();
const Role=require('../models/role')
const apiUtils=require('../utils/apiUtils')
const logger=require('../utils/logger')
const HttpStatus=require('http-status-codes');
const verify = require('../middlewares/verify');
const mongoose=require('mongoose')
const User=require('../models/user')

router.post('/role',(req,res)=>{
    logger.debug('inside post /role api')
    const obj={
        name:req.body.name,
        scopes:req.body.scopes
    }
    try{
        Role.create(obj)
        .then((response)=>{
            logger.debug('Role created successfully')
            res.status(HttpStatus.OK).json(apiUtils.getResponse('true',{data:response}))
        })
        .catch((err)=>{
            logger.debug(`Error :: ${err.message}`)
            res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{error:err.message}))
        })
    }
    catch(expection){
        logger.debug('Exception Occured')
    }
})

router.get('/role',verify,(req,res)=>{
    logger.debug('inside get all roles api')
    const userId=req.user.userId;
    User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$lookup:{from:"roles",localField:"roleId",foreignField:"_id",as:"roles"}},{$match:{"roles.scopes":{$in:["role-get"]}}}])
    .then((result)=>{
        if(result.length){
            return Role.find()
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


module.exports=router;