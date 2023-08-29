import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import passport from "passport";
import httpStatus from "http-status";
import morgan, { errorHandlerConfig } from "./config/morgan.js";
import { authLimiter } from "./middlewares/rateLimiter.js";
import ApiError from "./utills/ApiError.js";
import { errorHandler, errorConverter } from "./middlewares/error.js";
import router from "./router/v1/route.js";

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandlerConfig);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
// app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
// require("./config/passport")(passport);
// configurePassport(passport);
app.use(passport.initialize());
// passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
// if (process.env.NODE_ENV === "production") {
//   app.use("/v1/auth", authLimiter);
// }

// v1 api routes
app.use("api/v1", router);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
