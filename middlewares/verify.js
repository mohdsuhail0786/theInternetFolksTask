require('dotenv').config();
const HttpStatus = require('http-status-codes')
const apiUtils = require('../utils/apiUtils');
const logger = require('../utils/logger');


const verify=(req,res,next)=>{
    const authorization=req.headers.authorization;
    const token=authorization.split(' ')[1];
    if(token){
        apiUtils.verifyAccessToken(token,process.env.TOKEN_SECRET)
        .then((result)=>{
            req.user=result;
            next();
        })
        .catch((err)=>{
            logger.debug(`Error :: ${err.message}`)
            res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{errors:[{message:err.message}]}))
        })
    }
    else{
        res.status(HttpStatus.BAD_REQUEST).json(apiUtils.getResponse('false',{errors:[{message:'token not found'}]}))
    }
}

module.exports = verify;