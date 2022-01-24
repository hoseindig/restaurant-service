var express = require("express");
var cors = require("cors");
var app = express();
const Joi = require("joi");

const port = 3100;
app.use(cors());
debugger;
const mongoose = require("mongoose");
// const config = require("config");

app.get("/test", function (req, res, next) {
  res.json({ msg: "This is test CORS-enabled for all origins!" });
});
app.get("/products/:id", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

app.get("/getMovieList", function (req, res, next) {
  getMovieData(res);
});

app.listen(port, function () {
  console.log("CORS-enabled web server listening on port ", port);
});

const schemaGenre = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});
const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: schemaGenre,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);

const schemaMovie = {
  title: Joi.string().min(5).max(50).required(),
  genreId: Joi.required(),
  numberInStock: Joi.number().min(0).required(),
  dailyRentalRate: Joi.number().min(0).required(),
};

const mongoDB = "mongodb://127.0.0.1/vidly";
async function mongooseInit() {
  try {
    mongoose.connection
      .on("error", (err) => {
        console.error(err);
      })
      .on("open", (err) => {
        console.log("%cDB connected", "background:green");
      });

    await mongoose.connect(mongoDB, { useNewUrlParser: true });
  } catch (error) {
    console.log(error);
  }
}

async function getMovieData(res) {
  // await mongoose.connect(config.get("db"));
  try {
    await Movie.find({}, function (err, data) {
      console.log(">>>> " + data);
      res.json({ isSuccess: true, msg: "success", data });
    });
  } catch (e) {
    res.json({ isSuccess: false, msg: "error " + e });
  }
  // mongoose.disconnect();
  // console.info("Done!");
}
mongooseInit();
