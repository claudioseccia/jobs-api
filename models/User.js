const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//SCHEMA
//and email validation with regex. unique will create a unique index for the email field
const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true,"Please provide a name"],
        minlenght: 3,
        maxlenght: 50,
    },
    email: {
        type:String,
        required: [true,"Please provide an email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Please provide valid email"],
        unique: true,
    },
    password: {
        type:String,
        required: [true,"Please provide a password"],
        minlenght: 6
    },
});
//HASH PASSWORD in mongoose middleware: always encrypt password and NEVER save as strings
//MONGOOSE PRE MIDDLEWARE (https://mongoosejs.com/docs/middleware.html#pre)
//old function keyword instead of arrow function to get scoped to the document
//in mongoose 5.x next is not necessary:  userSchema.pre("save",async function(next) { ... next() }
UserSchema.pre("save",async function() {
    //generate the salt
    const salt = await bcrypt.genSalt(10);
    //get the password
    //this points to the document, we want to hash the password 
    this.password = await bcrypt.hash(this.password, salt);
    //pass to the next middleware (next not necessary since mongoose 5.x)
});
//MONGOOSE SCHEMA INSTANCE METHODS
//use the function keyword to get correct scope
// UserSchema.methods.getName = function() {
//     return this.name;
// }
UserSchema.methods.createJWT = function() {
    //return jwt.sign({userId: this._id, name: this.name},'JwtSecret', {expiresIn:'30d'}); 
    //TAKE JwtSecret and expiresIn values from .env file 
    //NOTE: JwtSecret generated from https://www.allkeysgenerator.com/ - Encryption key - 256bit
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET , {expiresIn:process.env.JWT_LIFETIME}); 
}
// password compare
UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}
module.exports = mongoose.model('User',UserSchema);