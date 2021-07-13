const router=require('express').Router();
const Role=require('../models/role')
const apiUtils=require('../utils/apiUtils')
const logger=require('../utils/logger')
const HttpStatus=require('http-status-codes');

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

router.get('/role',(req,res)=>{
    logger.debug('inside get all roles api')
    try{
        Role.find()
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