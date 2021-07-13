const jwt=require('jsonwebtoken');

exports.getResponse=(status,content)=>{
    return {
        status,
        content
    }
}

exports.getError=(status,error)=>{
    return {
        status,
        content
    }
}

exports.generateAccessToken=(payload,token_secret)=>{
    return jwt.sign(payload,token_secret,{expiresIn:'3600s'});
}

exports.verifyAccessToken=(token,token_secret)=>{
    return new Promise((resolve,reject)=>{
        jwt.verify(token,token_secret,(err,decoded)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(decoded);
            }
        })
    })
}

