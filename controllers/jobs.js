const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const {BadRequestError, NotFoundError} = require("../errors");

const getAllJobs = async(req,res) => {
    //res.send('Get all jobs');
    //find method of the model
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({ jobs, count:jobs.length });
}
const getJob = async(req,res) => {
    // res.send('Get single jobs');
    const {user:{userId},params:{id:jobId}} = req; //destructure req
    
    const job = await Job.findOne({createdBy: userId, _id: jobId });
    if(!job) {
        throw new NotFoundError(`No job for id ${jobId}`);
    }
    res.status(StatusCodes.OK).json(job);
}
const createJob = async(req,res) => {
    //res.send('Create job');
    //res.json(req.user); //test it the user is back from authentication
    //res.json(req.body); //check the body
    req.body.createdBy = req.user.userId; //IMPORTANT!!! get the req.user.userId from the authentication and assign it to req.body.createdBy
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
    //now the create job endpoint returns a complex object as defined in the mongoose
}
const updateJob = async(req,res) => {
    // res.send('Update job');
    //destructuring
    const {
        body: {company, position},
        user: {userId},
        params: {id:jobId}
    } = req;
    if(company===''||position==='') {
        throw new BadRequestError("Company or Position fields cannot be empty");
    }
    const job = await Job.findByIdAndUpdate({_id:jobId, createdBy:userId},req.body,{new:true, runValidators: true}); //new:true get back the updated object 
    if(!job) {
        throw new NotFoundError(`No job for id ${jobId}`);
    }
    res.status(StatusCodes.OK).json(job);
}
const deleteJob = async(req,res) => {
    // res.send('Delete job');
    const {
        user: {userId},
        params: {id:jobId}
    } = req;
    const job = await Job.findOneAndRemove({_id:jobId, createdBy:userId});
    if(!job) {
        throw new NotFoundError(`No job for id ${jobId}`);
    }
    res.status(StatusCodes.OK).send(); //just send back the 200 status code
}
module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}