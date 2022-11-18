// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  //
  //DUPLICATE ERROR HANDLING
  let customError = {
    //set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later"
  }
  //Validation Error
  //multiple values missing in the registration
  if(err.name==="ValidationError") {
    console.log(Object.values(err.errors));
    //get all the values for the keys in the validation object (Object.values), cycle through them and join as a string putting spaces.
    customError.msg = Object.values(err.errors).map(item=>item.message).join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  //Duplicate Email (sent back by mongoose validation with error 11000)
  if(err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  //Cast Error
  //if for ex. we try to get one Job with {{URL}}/jobs/6376531faafbc56d69f6becaAAA (AAA is making this id wrong, hemce a cast error)
  if(err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}.`;
    customError.statusCode = StatusCodes.NOT_FOUND; //404
  }
  //uncomment to see the exact error returned by mongoose validator:
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  //Cast error
  return res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandlerMiddleware
