"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var createError = require("http-errors");
const express_1 = __importDefault(require("express"));
var path = require("path");
const session = require("express-session");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const bcrypt = require("bcrypt");
const passport_1 = __importDefault(require("passport"));
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const index_1 = __importDefault(require("./routes/index"));
const messages_1 = __importDefault(require("./routes/messages"));
const membership_1 = __importDefault(require("./routes/membership"));
const User_1 = require("./models/User");
//set up database
const mongoURI = "mongodb+srv://pong:pong@cluster0.bnvrbtj.mongodb.net/?retryWrites=true&w=majority";
const mongoDB = process.env.DB_KEY || mongoURI;
mongoose.connect(process.env.DB_KEY, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
var app = (0, express_1.default)();
// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express_1.default.static(path.join(__dirname, "public")));
passport_1.default.serializeUser((user, done) => {
    return done(null, user.id);
});
//current problem is this is not being called
passport_1.default.deserializeUser((id, done) => {
    User_1.User.findById(id, function (err, user) {
        if (err) {
            return done(err);
        }
        //assigns user to req.user
        done(null, user);
    });
});
// passprt.authenticate calls this callback
//done calls serializeUser
passport_1.default.use(new LocalStrategy(function verify(username, password, done) {
    User_1.User.findOne({ username: username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
                // passwords match! log user in
                return done(null, user);
            }
            else {
                // passwords do not match!
                return done(null, false, { message: "Incorrect password" });
            }
        });
    });
}));
//set up session
app.use(session({
    secret: "pong",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoDB }),
    cookie: {
        expires: 60 * 60 * 24 * 1000,
    },
}));
//checks if current session has req.session.passport, if so saves user id onto it
app.use(passport_1.default.initialize());
//calls passport authenticator,
//1. Takes the MongoDB user ID obtained from the `passport.initialize()` method (run directly before) and passes it to the `passport.deserializeUser()` function (defined above in this module).  The `passport.deserializeUser()`
//If the `passport.deserializeUser()` returns a user object, this user object is assigned to the `req.user` property
app.use(passport_1.default.session());
app.use(passport_1.default.authenticate("session"));
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use(function (req, res, next) {
    res.locals.errors = null;
    next();
});
//routes
app.use("/", index_1.default);
app.use("/message", messages_1.default);
app.use("/membership", membership_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
module.exports = app;
