const User = require("../models/User");
const  {StatusCodes} = require("http-status-codes");
const {BadRequestError, UnauthenticatedError} = require("../errors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const register = async(req,res) => {
    //res.send('Register user');
    //USER CREATION
    /*
    // Moved to ./middleware/User.js
    //HASH PASSWORD: always encrypt password and NEVER save as strings
    const {name,email,password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const tempUser =  {name,email,password:hashedPassword}
    //OPTIONAL CHECK (we already check with mongoose validator) - check for empty values here in the controller:
    if(!name || !email || !password) {
        throw new BadRequestError('Please provide name, email and password.');
    }
    const user = await User.create({...tempUser});
    */
    //mongo way to create user based on the defined schema. We spread tempUser (req.body with hashed password)
    const user = await User.create({...req.body});
    
    // create JWT token - moved in the schema with mongoose schema instance method
    //const token = jwt.sign({userId: user._id, name: user.name},'JwtSecret', {expiresIn:'30d'}); 
    // mongoose schema instance method example
    //res.status(StatusCodes.CREATED).json({user:{name: user.getName()}, token}); //using mongoose schema instance method in ./models/User.js to get name (getName())

    //send back the token (ex .json({token})) - or - any other needed value
    //res.status(StatusCodes.CREATED).json({user:{name: user.name}, token}); 
    const token = user.createJWT(); // mongoose schema instance method in ./models/User.js
    res.status(StatusCodes.CREATED).json({user:{name: user.name}, token}); 
}
const login = async(req,res) => {
    //res.send('Login user');
    //check if both values are present
    const {email,password} = req.body;
    if(!email || !password) { //need to check here otherwise bcrypt compare will throw an error 
        throw new BadRequestError('Please provide email and password.');
    }
    //check for email and password in db
    const user = await User.findOne({email});
    //if we found one, send back the user - otherwise send an error
    if(!user) {
        throw new UnauthenticatedError("Invalid credentials"); //User is providing invalid credentials
    } 
    //compare password using bcrypt
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid credentials"); //User is providing invalid credentials
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name}, token});
}
module.exports = {
    register,
    login
}