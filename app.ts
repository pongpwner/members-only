var createError = require("http-errors");
import express, { Express, Request, Response } from "express";
var path = require("path");
const session = require("express-session");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const bcrypt = require("bcrypt");
import passport from "passport";
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
import indexRouter from "./routes/index";
import messageRouter from "./routes/messages";
import membershipRouter from "./routes/membership";

import { User } from "./models/User";
import { IUser } from "./models/User";
export interface IUserReq extends Request {
  user: IUser;
}
//set up database
const mongoURI =
  "mongodb+srv://pong:pong@cluster0.bnvrbtj.mongodb.net/?retryWrites=true&w=majority";
const mongoDB = process.env.DB_KEY || mongoURI;
mongoose.connect(process.env.DB_KEY, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//set up passport 2 methods

//runs on login
interface IPassportUser {
  id?: string;
}
passport.serializeUser((user: IPassportUser, done) => {
  return done(null, user.id);
});

//current problem is this is not being called
passport.deserializeUser((id, done) => {
  User.findById(id, function (err: Error, user: IUser) {
    if (err) {
      return done(err);
    }
    //assigns user to req.user
    done(null, user);
  });
});

// passprt.authenticate calls this callback

//done calls serializeUser
passport.use(
  new LocalStrategy(function verify(
    username: string,
    password: string,
    done: Function
  ) {
    User.findOne({ username: username }, (err: Error, user: IUser) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      bcrypt.compare(password, user.password, (err: Error, res: Object) => {
        if (res) {
          // passwords match! log user in

          return done(null, user);
        } else {
          // passwords do not match!

          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);
//set up session

app.use(
  session({
    secret: "pong",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoDB }),
    cookie: {
      expires: 60 * 60 * 24 * 1000,
    },
  })
);
//checks if current session has req.session.passport, if so saves user id onto it
app.use(passport.initialize());
//calls passport authenticator,
//1. Takes the MongoDB user ID obtained from the `passport.initialize()` method (run directly before) and passes it to the `passport.deserializeUser()` function (defined above in this module).  The `passport.deserializeUser()`
//If the `passport.deserializeUser()` returns a user object, this user object is assigned to the `req.user` property
app.use(passport.session());

app.use(passport.authenticate("session"));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use(function (req, res, next) {
  res.locals.errors = null;
  next();
});
//routes
app.use("/", indexRouter);
app.use("/message", messageRouter);
app.use("/membership", membershipRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
interface ResponseError extends Error {
  status?: number;
}
app.use(function (
  err: ResponseError,
  req: Request,
  res: Response,
  next: Function
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
