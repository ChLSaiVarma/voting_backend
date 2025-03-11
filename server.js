const express = require('express')
const app = express()
const db=require('./db')
const { Passport } = require('passport');
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.json())


const userRoutes=require('./routes/userRoutes');
//use the routers
app.use('/user',userRoutes);
const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log('App is running', PORT);
})
