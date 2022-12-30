var createError = require("http-errors");
var express = require("express");
var path = require("path");
const session = require("express-session");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FileStore = require("session-file-store")(session);
const mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var messageRouter = require("./routes/messages");
const User = require("./models/User");

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
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//set up passport 2 methods

//runs on login
passport.serializeUser((user, done) => {
  console.log(user);

  return done(null, user.id);
});

//current problem is this is not being called
passport.deserializeUser((id, done) => {
  console.log("deserializeeeeeeeeeeeeeeeeeeeeeeeeeee");

  User.findById(id, function (err, user) {
    if (err) {
      return done(err);
    }

    console.log(id);
    console.log(user);
    //assigns user to req.user
    done(null, user);
  });
});

// passprt.authenticate calls this callback

//done calls serializeUser
passport.use(
  new LocalStrategy(function verify(username, password, done) {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log("1");
        return done(err);
      }
      if (!user) {
        console.log("2");
        return done(null, false, { message: "Incorrect username" });
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          console.log("3");
          return done(null, user);
        } else {
          // passwords do not match!
          console.log("4");
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
    store: new FileStore(),
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
  console.log(req.user);
  res.locals.currentUser = req.user;
  next();
});
//routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/message", messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
