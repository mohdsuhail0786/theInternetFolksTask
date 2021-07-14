const router=require('express').Router();
const School=require('../models/school')
const Student=require('../models/student')
const apiUtils=require('../utils/apiUtils')
const logger=require('../utils/logger')
const HttpStatus=require('http-status-codes');
const student = require('../models/student');

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

router.get('/school/students',(req,res)=>{
    logger.debug('inside get all students of all schools')
    let schools;
    School.find()
    .then((result)=>{
        if(result.length){
            logger.debug('schools fetched')
            schools=result
            return Student.find()
        }
        else{
            return Promise.reject(new Error('No school found'))
        }
    })
    .then((allStudents)=>{
        const newArr=schools.map(school => {
            const {_id,name,city,state,country,created,updated} = school;
            const obj={_id,name,city,state,country,created,updated};
            const schoolStudent=allStudents.filter(student=>JSON.stringify(student.schoolId)===JSON.stringify(obj._id))
            obj.students=schoolStudent
            return obj;
        });
        res.status(HttpStatus.OK).json(apiUtils.getResponse('true',{data:newArr}))
    })
    .catch((err)=>{
        logger.error(`Error :: ${err.message}`)
        res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{error:err.message}))
    })
})

module.exports=router;