import { User, Role, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { encryptPassword } from "../utils/encryption";
import { PrismaClient } from "@prisma/client";
import { generatePassword, slug } from "../utills/helper.js";

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

 const createUser = async (email, password, name, role) => {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User Not found");
    }

    const [salt, hash] = generatePassword();

    const createUser = prisma.user.create({
        data: {
            email: email,
            name: name,
            password: hash,
            salt: salt,
            slug: slug(),
            role: role,
        },
    });

    return createUser;
};

 const getUserByID = async (id, keys) => {
    const user = prisma.user.findUnique({
        where: { id },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });

    return user;
};

 const getUserByEmail = async (email, keys) => {
    const user = prisma.user.findUnique({
        where: { email },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });

    return user;
};

const updateUserByID = async (
    userID,
    updateBody,
    key = ["id", "email", "name", "role"]
) => {
    const user = getUserByID(userID, ["id", "email", "name"]);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
    }

    if (updateBody.email && (await getUserByEmail(updateBody.email))) {
        throw new ApiError(httpStatus.BAD_REQUEST, " Email already in use");
    }

    const updateUser = prisma.user.update({
        where: { id: userId },
        data: updateBody,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });

    return updateUser;
};

const deleteUserById = async (userID) => {
    const user = getUserByID(userID, ["id", "email", "name"]);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
    }

    await prisma.user.delete({ where: { id: userID } });

    return user;
};


export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};