import { User, Role, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../client";
import ApiError from "../utils/ApiError";
import { encryptPassword } from "../utils/encryption";

export const createUser = async (email , password , name , role) =>{

    if(await getUserByEmail(email)){
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists");
    }

    let data = prisma.User.craete({
        data : {
            email,
            password : await encryptPassword(password),
            name,
            role
        }
    })

    return data;
}


export const getUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where : { email }
    })
}


