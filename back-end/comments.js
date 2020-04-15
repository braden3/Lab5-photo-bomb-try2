const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

// Configure multer so that it will upload to '/public/images'

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  /*path: String,
  title: String,
  description: String,*/
  description: String,
  photo: {
      type: mongoose.Schema.ObjectId,
      ref: 'Photo',
  },
  created: {
    type: Date,
    default: Date.now
  },
});

const Comment = mongoose.model('Comment', commentSchema);

// upload photo
router.post("/", validUser, /*upload.single('comment'),*/ async (req, res) => {
  // check parameters
  /*if (!req.file)
    return res.status(400).send({
      message: "Must upload a file."
    });*/
console.log(req.body);
//console.log(req);
  const comment = new Comment({
    user: req.body.user,
    path: "/comments/" + req.body.path,
    //title: req.body.title,
    description: req.body.description,
  });
  try {
    await comment.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

});

// get my photos

router.get("/all", async (req, res) => {
  try {
    let comment = await Comment.find().sort({
      created: -1
    }).populate('user');
    return res.send(comment);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let comment = await Comment.findOne({
      _id: req.params.id,
    }).populate('user');
    await comment.save();
    return res.send(comment);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});



module.exports = {
  model: Comment,
  routes: router,
}
