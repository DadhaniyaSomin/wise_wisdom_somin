import httpStatus from "http-status";
import ApiError from '../utills/ApiError.js';
import { TokenType, User } from "@prisma/client";
import { getUserByEmail } from '../services/user.service.js';
import { generateAuthToken, verifyToken } from '../services/tokenService.service.js';
// import { encryptPassword, isPasswordMatch } from "../utils/encryption.js";
import exclude from "../utills/exclude.js";
import { PrismaClient } from "@prisma/client";
import { generatePassword } from '../utills/helper.js';

const prisma = new PrismaClient({
    log: [
        {
            emit: "stdout",
            level: "query",
        },
        {
            emit: "stdout",
            level: "error",
        },
        {
            emit: "stdout",
            level: "info",
        },
        {
            emit: "stdout",
            level: "warn",
        },
    ],
});

prisma.$on("query", (e) => {
    console.log("Query: " + e.query);
    console.log("Params: " + e.params);
    console.log("Duration: " + e.duration + "ms");
});


const loginWithEmailAndPassword = async (email, password) => {
    const user = await getUserByEmail(email, [
        'id',
        'email',
        'name',
        'password',
        'role',
        'isEmailVerified',
        'createdAt',
        'updatedAt'
    ]);
    const passwordMatch = await isValidPassword(password, user.password, user.salt);
    if (!passwordMatch || !user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, " Incorrect Email or password.");
    }
    return exclude(user, ['password']);
}


const logout = async (refreshToken) =>{
    const refreshTokenData = await prisma.token.findFirst({
        where : {
            token : refreshToken ,
            type : TokenType.REFRESH,
            blacklisted : false
        }
    })

    if(!refreshTokenData)
    {
       throw new ApiError(httpStatus.NOT_FOUND ,"Token not found");
    }
    await prisma.token.delete({ where: { id: refreshToken.id }});
}

const refreshAuth = async ( refreshToken) =>{
     try{
        const refreshTokenData = await verifyToken(refreshToken , TokenType.REFRESH);
        const { userID} = refreshTokenData;
        await prisma.token.delete({where : { id: refreshTokenData.id}});
        return generateAuthToken =({id : userID});
     }catch (error){
        throw new ApiError( httpStatus.UNAUTHORIZED ,"Please authanticate.");
     }
}

const resetPassword = async ( resetPasswordToken , newPassword) =>{
     try{
        const resetPasswordTokenData = await verifyToken(resetPasswordToken ,  TokenType.RESET_PASSWORD);
        const user = await getUserByID(resetPasswordTokenData.userID);
        if(!user){
            throw new Error()
        }

        const encryptPassword = generatePassword();
        await updateUserByID(user.id , { password : encryptPassword}) ;
        await prisma.token.deleteMany({
            where : {userId : user.id , type : TokenType.RESET_PASSWORD}
        })
     }catch (error)
     {
        throw new ApiError(httpStatus.UNAUTHORIZED , "Password reset failed");
     }

}

const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenData = await verifyToken(
      verifyEmailToken,
      TokenType.VERIFY_EMAIL
    );
    await prisma.token.deleteMany({
      where: {
        userId: verifyEmailTokenData.userId,
        type: TokenType.VERIFY_EMAIL,
      },
    });
    await updateUserById(verifyEmailTokenData.userId, {
      isEmailVerified: true,
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};


export default {
  loginWithEmailAndPassword,
  logout,
  refreshAuth
};
