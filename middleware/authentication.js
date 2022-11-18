const user = require("../models/User");
const jwt = require("jsonwebtoken");
const {UnauthenticatedError } = require("../errors");

const auth = (req,res,next) => {
    //check header
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")) {
        throw new UnauthenticatedError("Authentication invalid");
    }
    const token = authHeader.split(" ")[1]; //check the value after Bearer
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        //attach the user to the job routes
        req.user = {userId:payload.userId, name:payload.name};
        next();
        //alternative way: look for user and remove the password
        // const user = User.findById(payload.id).select("-password");
        // req.user = user;
        // next();
    }catch (error) {
        throw new UnauthenticatedError("Authentication invalid");
    }
}
module.exports = auth;