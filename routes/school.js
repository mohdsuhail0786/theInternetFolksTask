const router=require('express').Router();
const School=require('../models/school')
const apiUtils=require('../utils/apiUtils')
const logger=require('../utils/logger')
const HttpStatus=require('http-status-codes');

router.post('/school',(req,res)=>{
    logger.debug('inside add school api')
    const {name,city,state,country} = req.body
    School.create({name,city,state,country})
    .then((response)=>{
        logger.debug('School registered successfully');
        res.status(HttpStatus.OK).json(apiUtils.getResponse('true',{data:response}))
    })
    .catch((err)=>{
        logger.debug(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{error:err.message}))
    })
})

router.get('/school',(req,res)=>{
    logger.debug('inside get all schools api')
    try{
        School.find()
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