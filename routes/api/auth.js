const express = require('express');
const router = express.Router();
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require('bcryptjs');
const key = require("../../setup/myurl");


//getting Schema from Person.js
const Person = require('../../models/person');
//router.use(authMiddware);
//@type POST
//@route /api/auth/register
//@desc just for registration;
//@access PUBLIC

router.post('/register',(req,res)=>
{
Person.findOne({email:req.body.email})
    .then(person=>    //object from mongodb
        {
            //if person is not null means it is present in db i.e  ALLREADY REGISTERED
            if(person)
            {
                return res.status(400).json({emailerror:'email is already in our system'});
            }else
            {
                var newperson = new Person({
                    name: req.body.name,
                    email:req.body.email,
                    password: req.body.password,
                    username:req.body.username,
                    gender:req.body.gender,
                });
                // Encrypt password using bcrypt
                bcrypt.genSalt(10, (err, salt)=> {
                bcrypt.hash(newperson.password, salt, function(err, hash) {
                    
                    if(err) throw err;
                    
                    newperson.password=hash;
                    
                    // Store hash in your password DB.
                    newperson.save()
                    .then(person=>res.json(person))
                    .catch(err => console.log('this is saving data error: \n'+err))

                });
                });
            }
        })
    .catch((err)=>console.log('this is a person error'+err))
})

//@type POST
//@route /api/auth/login
//@desc just for login;
//@access PUBLIC

router.post('/login',(req,res)=>
{
    const email=req.body.email;
    const password = req.body.password;
    Person.findOne({email:req.body.email})
    .then(person=>
        {
            if(!person)
            {
                return res.status(404).json({emailerror:"user not found with this email"});
            }else
            {
                //checking the password
                bcrypt.compare(password, person.password, (err,correct)=>
                {
                    if(err)
                    {
                        console.log(err);
                        return;
                    }
                    if(correct)
                    {
                        //use payload and create token for the user
                        console.log(person.id);
                        const payload ={
                            id:person.id,
                            name:person.name,
                            email:person.email,
                            gender:person.gender
                        }
                        jsonwt.sign ({
                            data: payload,
                          }, key.secret , { expiresIn: 60 * 60 },
                          (err,token)=>
                          {
                                if(err)
                                {
                                    console.log('this is a token error '+ err);
                                    return;
                                }
                                
                                res.status(200).json({ 
                                    email:person.email,
                                    token: "Bearer " +token,
                                    id:person.id
                                })
                          }
                          
                          );

                    }else
                    {
                        res.status(401).json({password:"check your password"});
                    }
                })
                
            }
        })
    .catch(err => console.log(err))
})


//@type GET
//@route /api/auth/profile
//@desc route for user profile through passport-jwt;
//@access private

router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res)=>
{ 
    console.log(req);
    res.json({
        name:req.user.name,
        email:req.user.email,
        username:req.user.username,
        gender:req.user.gender

    })
})


// import from index.js
module.exports=router;