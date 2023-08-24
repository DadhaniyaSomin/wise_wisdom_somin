import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { NextFunction, Request, Response } from "express";
import pick from "../utils/pick";
import Joi from "joi";

const validate =
  (schema) => (req, res, next) => {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const obj = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ err  ors: { label: "key" }, abortEarly: false })
      .validate(obj);
    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
  };

export default validate;