const express = require('express');
const route = require('route')
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const passport = require("passport");



//bring all route
const auth = require('./routes/api/auth');
const questions = require('./routes/api/questions');
const profile = require('./routes/api/profile');

const app = express();


//body- parser middleware
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());



//mongodb configration
const db=require('./setup/myurl').mongoURL;
mongoose
    .connect(db)
    .then(()=>console.log("Mongodb connected successfully"))
    .catch( err=> console.log(err))


//middleware for passport from passport org docs
app.use(passport.initialize());





//config the jwt stratergies
require("./strategies/jsonwebtoken")(passport);



//actual routes 
//- calling auth.js
app.use('/api/auth',auth);

//- calling questions
app.use('/api/questions',questions);

//-calling profile
app.use('/api/profile',profile);




// testing route
app.get('/',(req,res)=>
{
    res.send('hello');
})

app.listen(process.env.PORT||1773,()=>console.log("server runnng at port 1773"));
