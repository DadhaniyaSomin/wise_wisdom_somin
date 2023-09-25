import httpStatus from "http-status";
// import pick from '../../utills/pick.js';
// import ApiError from "../../utills/ApiError.js";
import catchAsync from './../../utills/catchAsync';
import { userService } from "../../services";

const createUser = catchAsync( async () =>{
     const { email  , password , name , role } = req.body;
     const user = await userService.createUser( email , password , name , role);
     res.status(httpStatus.CREATED).send(user);
})