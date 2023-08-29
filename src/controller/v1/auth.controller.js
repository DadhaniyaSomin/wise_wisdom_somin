import httpStatus from "http-status";
import catchAsync from '../../utills/catchAsync.js';

const register = catchAsync(async(req, res) =>{
    const { email , password } = req.body;
    cosnt user = await userService.createUser(email , password);
})

module.exports = {}