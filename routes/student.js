const router=require('express').Router();
const Student=require('../models/student')
const apiUtils=require('../utils/apiUtils')
const logger=require('../utils/logger')
const HttpStatus=require('http-status-codes');

router.post('/student',(req,res)=>{
    logger.debug('inside add student api')
    const {name,userId,schoolId} = req.body
    Student.create({name,userId,schoolId})
    .then((response)=>{
        logger.debug('Student registered successfully');
        res.status(HttpStatus.OK).json(apiUtils.getResponse('true',{data:response}))
    })
    .catch((err)=>{
        logger.debug(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{error:err.message}))
    })
})

router.get('/student',(req,res)=>{
    logger.debug('inside get all students api')
    try{
        Student.find()
        .then((response)=>{
            logger.debug('Data fetched successfully')
            res.status(HttpStatus.OK).json(apiUtils.getResponse('true',{data:response}))
        })
        .catch((err)=>{
            logger.debug(`Error :: ${err.message}`)
            res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{error:err.message}))
        })
    }
    catch(expection){
        logger.debug('Exception Occured')
        res.status(HttpStatus.BAD_REQUEST).json(exception)
    }
})

module.exports=router;