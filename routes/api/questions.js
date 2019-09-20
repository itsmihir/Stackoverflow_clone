const express = require('express');
const Router = require('router');
const router = Router();
const passport = require('passport');

const Question = require("../../models/question");
const Profile = require("../../models/profile");

//@type POST
//@route /api/questions/
//@desc just for getting the questions;
//@access PRIVATE
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>
{
    const myQuestion = new Question();

    myQuestion.user = req.user.id;
  if(req.body.questionText)  myQuestion.questionText = req.body.questionText;
  if(req.body.questionCode)  myQuestion.questionCode = req.body.questionCode;
    myQuestion.name = req.user.username;
    myQuestion.save()
    .then((question)=>
    {
        res.json(question);
    })
    .catch(err => console.log('error in saving the question '+ err))
})


//@type POST
//@route /api/questions/comment/:id
//@desc route to comment on a question based on ID (of the question not user (_id))
//@access PRIVATE

router.post('/comment/:id',passport.authenticate('jwt',{session:false}),(req,res)=>
{
    Question.findOne({_id:req.params.id})
    .then(question=>
        {
            if(!question)
            {
                return res.json({massage:" Can't find the question"});
            }
            const newANS={}

            newANS.user = req.user.id;
            newANS.answer=req.body.comment;
            newANS.name = req.user.username;
            question.comment.unshift(newANS);
            
            question.save()
            .then(question=>
                {
                    res.json(question);
                })
            .catch(err => console.log('error in saving the comment '+err))
        })
    .catch(err =>console.log('error in finding the question'+ err))
})




//@type GET
//@route /api/questions/
//@desc route to get all the questions
//@access PUBLIC

router.get('/',(req,res)=>
{
Question.find()
.sort({date:'desc'})
.then(question=>
    {
        res.json(question);
    })
.catch(err =>console.log('error in displaying all the questions'+err))
})



//@type POST
//@route /api/questions/upvote/:id
//@desc route to upvote ans devote a question
//@access PRIVATE

router.post('/upvote/:id',passport.authenticate('jwt',{session:false}),(req,res)=>
{

    Question.findById(req.params.id)
    .then(question=>
        {
            
            if(question.upvotes.filter(upvote =>
                upvote.user.toString() === req.user.id.toString()).length <=0)
            {
                
                question.upvotes.push({user:req.user.id});
                question.save()
                .then(question =>
                    {
                        res.json(question);
                    })
                .catch(err=>console.log(err))
            }else
            {
                const index = question.upvotes.indexOf({user:req.user.id});
               question.upvotes.splice(index,1);
               
               question.save()
               .then(question =>
                res.json(question))
               .catch(err => console.log(err))

            }
        })
    .catch(err =>console.log(err))
   
})


//@type DELETE
//@route /api/questions/remove/:id
//@desc route to remove a question
//@access PRIVATE

router.delete('/remove/:id',passport.authenticate('jwt',{session:false}),(req,res)=>
{
    Question.findByIdAndRemove(req.params.id)
    .then(()=>
    {
        res.json({massage:"removed question successfully"})
    })
    .catch(err => console.log(err))
})





module.exports=router;