require('dotenv').config();
const router=require('express').Router();
const User=require('../models/user')
const apiUtils=require('../utils/apiUtils')
const logger=require('../utils/logger')
const HttpStatus=require('http-status-codes');
const bcrypt=require('bcrypt');
const globalConstant = require('../utils/globalConstant');
const mongoose = require('mongoose');
const verify=require('../middlewares/verify')

router.post('/user/signup',(req,res)=>{
    logger.debug('inside signup api')
    const obj={
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        mobile:req.body.mobile,
        roleId:req.body.roleId
    }
    try{
        logger.debug('Hashing the password')
        bcrypt.hash(req.body.password,globalConstant.SALT_ROUNDS)
        .then((hashedPassword)=>{
            obj.password=hashedPassword
            logger.debug('Saving user to DB')
            return User.create(obj)
        })
        .then((response)=>{
            logger.debug('User created successfully')
            res.status(HttpStatus.OK).json(apiUtils.getResponse('true',{data:response}))
        })
        .catch((err)=>{
            logger.debug(`Error :: ${err.message}`)
            res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{error:err.message}))
        })
    }
    catch(exception){
        logger.debug('Exception occured')
        res.status(HttpStatus.BAD_REQUEST).json(exception)
    }
})

router.post('/user/signin',(req,res)=>{
    logger.debug('inside signin api')
    const {email,password} = req.body;
    let user;
    User.findOne({email})
    .then((result)=>{
        if(result){
            logger.debug('user found')
            user=result
            return bcrypt.compare(password,result.password)
        }
        else{
            return Promise.reject(new Error('User not found'))
        }
    })
    .then((isPasswordSame)=>{
        if(isPasswordSame){
            logger.debug('Password matched, generating access-token...')          
            const token=apiUtils.generateAccessToken({userId:user._id},process.env.TOKEN_SECRET)
            res.status(HttpStatus.OK).json(apiUtils.getResponse('false',{data:user,token}))
        }
        else{
            return Promise.reject(new Error('Password Not matched'))
        }
    })
    .catch((err)=>{
        logger.debug(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{error:err.message}))
    })
})

router.get('/user',verify,(req,res)=>{
    logger.debug('inside get all users api')
    const userId=req.user.userId;
    User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$lookup:{from:"roles",localField:"roleId",foreignField:"_id",as:"roles"}},{$match:{"roles.scopes":{$in:["user-get"]}}}])
    .then((result)=>{
        logger.debug('Data fetched successfully')
        if(result.length){
            return User.find()
        }
        else{
            return Promise.reject(new Error('access-denied, not allowed to perform this action'))
        }
    })
    .then((response)=>{
        res.status(HttpStatus.OK).json(apiUtils.getResponse('true',{data:response}))
    })
    .catch((err)=>{
        logger.debug(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{error:err.message}))
    })
})

router.get('/user/:userId',verify,(req,res)=>{
    logger.debug('inside get user from userId api')
    const id=req.params.userId
    const userId=req.user.userId;
    User.aggregate([{$match:{_id:mongoose.Types.ObjectId(userId)}},{$lookup:{from:"roles",localField:"roleId",foreignField:"_id",as:"roles"}},{$match:{"roles.scopes":{$in:["user-get"]}}}])
    .then((response)=>{
        logger.debug('Data fetched successfully')
        if(response.length){
            return User.findById(id)
        }
        else{
            return Promise.reject(new Error('access-denied, not allowed to perform this action'))
        }
    })
    .then((result)=>{
        res.status(HttpStatus.OK).json(apiUtils.getResponse('true',{data:result}))
    })
    .catch((err)=>{
        logger.debug(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{error:err.message}))
    })
})

module.exports=router;