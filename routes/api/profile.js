const express = require('express');
const passport = require("passport");
const mongoose = require("mongoose");
const router = express.Router();

//getting Schema from Person.js
const Person = require('../../models/person');

//getting Schema from profile.js
const Profile = require('../../models/profile');


mongoose.set('useFindAndModify',false)
// //@type GET
// //@route /api/profile/
// //@desc just for test;
// //@access PUBLIC
// router.get('/',(req,res)=>
// {
//     res.json({
//         test:'profile is check',
//     })
// })



//@type POST
//@route /api/profile/
//@desc just for getting/updating personal profile of a user;
//@access PRIVATE

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>
{
    console.log(req);
    const myprofile={}
        
    myprofile.user=req.user.id;
    console.log(myprofile.user);
    if(req.body.username) myprofile.username = req.body.username;
    if(req.body.website) myprofile.website = req.body.website;
    if(req.body.country) myprofile.country = req.body.country;
    if(req.body.portfolio) myprofile.portfolio = req.body.portfolio;

    if(typeof req.body.languages !== undefined) {
        myprofile.languages = req.body.languages.split(',');
    }

    myprofile.social={};
    
    if(req.body.instagram) myprofile.social.instagram = req.body.instagram;
    if(req.body.facebook) myprofile.social.facebook = req.body.facebook;
   

    Profile.findOne({user:req.user.id})
    .then(profile=>
        {
         
            if(profile)
            {
             
                Profile.findOneAndUpdate({user:req.user._id},{$set: myprofile},{new: true})
                .then(profile=> res.json(profile))
                .catch(err => console.log('profile update error '+err));
               
            }else
            {
            
            
                //checking if the username is taken or not
                Profile.findOne({username:req.body.username})
                .then(profile => {
                    
                    // username is taken
                    if(profile)
                    {
                        res.status(400).json({massage:"username already taken"});
                    }else
                    {
                        // username not taken then save myprofile

                     new Profile(myprofile).save()
                        .then(profile=>res.json(myprofile))
                        .catch(err=>console.log('saving the profile error'+err));
                    }
                } )
                .catch(err => console.log('error in finding the username'+err));
            }
        })
    .catch(err => console.log('this is a error in finding the user to update/save profile'+ err));

    
  //  Person.findOneAndUpdate({email:req.user.email},{$set: myprofile},{new : true});
}) 





//@type GET
//@route /api/profile/
//@desc just for personal profile of a user;
//@access PRIVATE

router.get('/',passport.authenticate('jwt', {session:false}),(req,res)=>
{   
    
console.log(req.user);
     Profile.findOne({user:req.user._id})
        .then(profile=>
            {
               
                if(!profile)
                {
                    return res.status(404).json({profilerror:"No profile found"});
                }
                res.json(profile);
            })
        
        .catch(err=>
            console.log("got some error in profile " +err))
})



//@type GET
//@route /api/profile/:username
//@desc just for viewing a profile of a user BASED ON USERNAME
//@access PUBLIC

router.get("/:username",(req,res)=>
{
    Profile.findOne({username:req.params.username})
    .populate("user",["name","profilepic"])
    .then(profile=>
        {
            if(!profile)
            {
                return res.status(404).json({massage:"username not found"});
            }
            res.status(200).json(profile)
        })   
    .catch(err => console.log('error in fetching user profile'+err));
})



//@type GET
//@route /api/profile/ID/:id
//@desc just for viewing a profile of a user BASED ON ID 
//@access PUBLIC

router.get('/ID/:id',(req,res)=>
{
    
    Profile.findOne({user:req.params.id})
    .populate('user',['name','profilepic'])
    .then(profile=>
        {
            if(!profile)
            {
                return res.status(404).json({massage:'user not found'});
            }
            res.json(profile);
        })
    .catch(err=>console.log(err))
})



//@type GET
//@route /api/profile/find/everyone
//@desc just for viewing all the user
//@access PUBLIC

router.get("/find/everyone",(req,res)=>
{
    Profile.find()
    .populate("user",["name","profilepic"])
    .then(profile=>
        {
            res.json(profile);
        })
    .catch(err=>console.log(err));
})

//@type DELETE
//@route /api/profile/
//@desc route to delete a user based on id
//@access PRIVATE

router.delete('/',passport.authenticate("jwt",{session:false}),(req,res)=>
{
    Profile.findOneAndRemove({user:req.user.id})
    .then(()=>
    {
        Person.findOneAndRemove({_id:req.user.id})
        .then(res.json({massage:"user deleted"}))
        .catch(err =>console.log(err));
    })
    .catch(err=>console.log(err))
})


//@type POST
//@route /api/profile/getworkrole
//@desc route to save the work role of a user
//@access PRIVATE

router.post('/getworkrole',passport.authenticate("jwt",{session:false}),(req,res)=>
{
    Profile.findOne({user:req.user.id})
    .then(profile=>
        {
            const myworkrole ={};
            
            myworkrole.role = req.body.role;
            myworkrole.company = req.body.company;
            myworkrole.country = req.body.country;
            myworkrole.from = req.body.from;
            myworkrole.to = req.body.to;
            myworkrole.current = req.body.current;

            profile.workrole.unshift(myworkrole);
           // profile.workrole =myworkrole;

            profile.save()
            .then((profile) =>
                {
                    res.json(profile);
                })
            .catch(err => console.log(err))
        })
    .catch(err => console.log(err))
})



//@type DELETE
//@route /api/profile/delete/workrole
//@desc route to delete the work role based on id of a user
//@access PRIVATE

router.delete('/delete/workrole/:ID',passport.authenticate('jwt',{session:false}),(req,res)=>
{
Profile.findOne({user:req.user.id})
.then(profile =>
    {
        if(!profile)
        {
            return res.status(404).json({massage:"error in finding the user"});
        }
        const workroleID = profile.workrole.map(item => item.id).indexOf(req.params.ID);
        
        profile.workrole.splice(workroleID,1);

        profile.save()
        .then((profile)=>
        {
            res.json(profile)
        })
        .catch(err =>console.log(err))
    })
.catch(err => console.log(err))
})

module.exports=router;