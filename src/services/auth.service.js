import httpStatus from "http-status";
import tokenService from 'token.service';
import userService from 'user.service';
import ApiError from '../utills/ApiError';
import { TokenType , User } from "@prisma/client";
import  prisma from "../client";
import { encryptPassword, isPasswordMatch } from "../utils/encryption";
import exclude from "../utils/exclude";

// const loginUserWithEmailAndPassword = async (email, password) => {
//      const user = async userService.getUserByEmail(email, [

//      ])
// }