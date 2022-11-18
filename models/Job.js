const mongoose = require("mongoose");
//JobSchema
const JobSchema = new mongoose.Schema({
    company: {
        type:String,
        required:[true,"Please provide company name"],
        maxLenght: 50
    },
    position: {
        type:String,
        required:[true,"Please provide position"],
        maxLenght: 100
    },
    status: {
        type:String,
        enum:["interview","declined","pending"],
        default:"pending"
    },
    createdBy: {
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,"Please provide a user"]
    }
},{timestamps:true});
//NOTE: createdBy associates the Job to an User

module.exports = mongoose.model('Job',JobSchema);