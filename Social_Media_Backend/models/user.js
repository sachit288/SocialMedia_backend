const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = require("./post");

const usersSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [{ 
    type: Schema.Types.ObjectId,
    ref: "Post"
  }],
  followers: [{ 
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  following: [{ 
    type: Schema.Types.ObjectId, 
    ref: "User" 
  }],
  
});

const User = mongoose.model("User", usersSchema);

module.exports = User;
