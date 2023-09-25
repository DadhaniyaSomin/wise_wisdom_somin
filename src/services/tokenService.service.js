import jwt from "jsonwebtoken";
import moment, { Moment } from "moment";
import httpStatus from "http-status";
import userService from "./user.service";
import ApiError from "../utils/ApiError";
import { Token, TokenType } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

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

import fs from "fs";
import path from "path";
import { type } from "os";

const pathtoKkey = path.join(__dirname, "..", "..", 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathtoKkey, 'utf8');


export const generateToken = (userID, ...arg) => {

    let _id = userID;
    const expiredIN = '1d'
    const payLoad = {};
    //create payload for JWT
    const finalPayLoad = Object.defineProperties(payLoad, {
        sub: {
            value: _id,
            writable: false
        },
        iat: {
            value: expiredIN,
            writable: false
        }
    });

    const signedTokens = jwt.sign(finalPayLoad, PRIV_KEY, {
        expiresIn: expiredIN,
        algorithm: "RS256",
    });

    return {
        token: "Bearer " + signedTokens,
        expires: expiresIn,
    };

}


export const saveToken = (token, userId, expires, type, blackListed) => {

    const createToken = prisma.token.create({
        data: {
            token,
            userId: userId,
            expires: expires,
            type,
            blacklisted,
        },
    });

    return createToken;

}


export const generateAuthToken = async (userID) => {
    const accessTokenExpiresTIme = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
    const accessToken = generateToken(userID, accessTokenExpiresTIme, TokenType.ACCESS);

    const refreshTokenExpiresTime = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days');
    const refershToken = generateToken(userID, refreshTokenExpiresTime, TokenType.REFRESH);

    await saveToken(refershToken, userID, refreshTokenExpiresTime, TokenType.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate()
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate()
        }
    };

}


export const generateResetPasswordToken = async (email) => {
    const email = await userService.getUserByEmail(email);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User Not found");
    }

    const resetPasswordTokenExpiresTime = moment().add(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 'minutes');
    const resetPasswordToken = generateToken(userID, resetPasswordTokenExpiresTime, TokenType.RESET_PASSWORD);

    await saveToken(resetPasswordToken, userID, resetPasswordTokenExpiresTime, TokenType.RESET_PASSWORD);

    return resetPasswordToken;
}


export const generateVerifyEmailToken = async (userID) => {

    const expires = moment().add(
        process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
        "minutes"
    );
    const verifyEmailToken = generateToken(
        userID,
        expires,
        TokenType.VERIFY_EMAIL
    );

    await saveToken(verifyEmailToken, userID, expires, TokenType.VERIFY_EMAIL);

    return verifyEmailToken;
};


export const verifyToken  = async ( token , type ) =>{
     const payLoad = jwt.verify( token,  PRIV_KEY );
     const userID  = Number(payLoad.sub);
     const tokenData = await prisma.token.findFirst({
        where : { token , type, userID , blacklisted}
     });

     if(!tokenData)
     {
        throw new Error("Token not found.");
     }

     return tokenData;
}