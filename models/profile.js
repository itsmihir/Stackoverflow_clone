const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var profileSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref:"users"
    },
    username:{
        type:String,
        required : true,
        max:50
    },
    website:
    {
        type:String
    },
    country:{
        type:String,
    },
    languages:{
        type:[String],
        required:true
    },
    portfolio:{
        type:String
    },
    workrole:[
       { 
        role : {
            type:String,
            required:true,
        },
        company :{
            type:String
        },
        country:{
            type:String
        },
        from:{
            type:Date,
        },
        to:{
            type:Date
        },
        current:
        {
            type:Boolean,
            default:false
        }
    }
    ],
    social:{
        
        instagram:{
            type:String,
        },
        facebook:
        {
            type:String,
        }
        
    }

})

module.exports = profileSchema = mongoose.model("profiles",profileSchema);