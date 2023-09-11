const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = require("./user");
const Comment = require("./comment");

const postsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
  comments: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Comment" 
  }],
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: "User" 
  }]
});

const Post = mongoose.model("Post", postsSchema);

module.exports = Post;

