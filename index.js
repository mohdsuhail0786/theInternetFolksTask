require('dotenv').config()
const express=require('express')
const cors=require('cors')
// const crypto=require('crypto')
const logger=require('./utils/logger')
const {mongoConnect}=require('./utils/dbutils')
const PORT=process.env.PORT || 4000;
const roleRoutes=require('./routes/role')
const userRoutes=require('./routes/user')
const studentRoutes=require('./routes/student')
const schoolRoutes=require('./routes/school')

const app=express()

app.use(express.json())
app.use(cors())
app.use([roleRoutes,userRoutes,studentRoutes,schoolRoutes])


app.listen(PORT,()=>{
    // console.log(crypto.randomBytes(100).toString('base64'));
    logger.info(`Application is up on --> http://localhost:${PORT}`);
    mongoConnect();
})