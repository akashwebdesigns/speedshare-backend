const express=require('express');
const app=express();
require('dotenv').config();
const path=require('path');
const dbConn=require('./config/db');
const cors=require('cors')
const PORT=process.env.PORT || 3000;

//json
app.use(express.json());
app.use(express.static('public'))

//Database Connection
dbConn();

//Cors
const corsOptions={
    origin:'http://localhost:3000'
}
app.use(cors());

//View Engine
app.set('views',path.join(__dirname,'/views'))
app.set('view engine','ejs')

//Routes Initialise

app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show.js'))
app.use('/files/download',require('./routes/download'));

app.listen(PORT,()=>{
    console.log(`Server is started at port ${PORT}`);
})