const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const question = new Schema({
    
    user:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    name:{
        type:String,
    },
    questionText:
    {
        type:String,
        required:true
    },
    questionCode:{
        type:String
    },

    comment:[{
        user:
        {type:Schema.Types.ObjectId,
        ref:"users"
        },
        answer:{
        type:String
        },
        date:
        {
            type:Date,
            default:Date.now()
        },
        name:{
            type:String,
        },
    }],
    upvotes:[
        {
        user:{
            type:Schema.Types.ObjectId,
            ref:"users"
        },
       
    }
    ],
    
    date:
    {
        type:Date,
        default:Date.now()
    }
})



module.exports = questionSchema = mongoose.model("questions",question); 