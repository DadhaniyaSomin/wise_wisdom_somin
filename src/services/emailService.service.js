import httpStatus from 'http-status';
import tokenService from './token.service';
import userService from './user.service';
import ApiError from '../utils/ApiError';
import { TokenType, User } from '@prisma/client';
import prisma from '../client';
import { encryptPassword, isPasswordMatch } from '../utils/encryption';
import { AuthTokensResponse } from '../types/response';
import exclude from '../utils/exclud';

const loginWithUserAndPassword = (email, password) =>