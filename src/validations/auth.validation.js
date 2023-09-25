// import Joi from 'joi';
import  Joi from "joi";
import { password} from './custom.validation.js';

// const register = {
//      body : Joi.object.keys({
//          email : Joi.string().required().email(),
//          password : Joi.string().required().custom(password)
//      })
// };

const register = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

const login = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object({
    token: Joi.string().required(),
  }),
  body: Joi.object({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object({
    token: Joi.string().required(),
  }),
};

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};