const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// add logging system

const morgan = require("morgan");
app.use(morgan("tiny"));

// const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const loginRoutes = require("./routes/login");
const groupRoutes = require("./routes/groups");
const trackRoutes = require("./routes/tracks");
const artistRoutes = require('./routes/artists');
app.use("/login", loginRoutes);
app.use("/users", usersRoutes);
app.use("/groups", groupRoutes);
app.use("/tracks", trackRoutes);
app.use("/artists", artistRoutes);
// app.use("/", authRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;

  // pass the error to the next piece of middleware
  return next(err);
});


//401 handler to catch spotify 401 errors
app.use(function(err, req, res, next){
  if(err.response && err.response.status === 401 ) {
    res.status(401);
    return res.json({
      error: err,
      message: err.message
    });
  }
  else{
    return next(err);
  }
});

/** general error handler */
app.use(function (err, req, res, next) {
  if (err.stack) console.log(err.stack);

  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
