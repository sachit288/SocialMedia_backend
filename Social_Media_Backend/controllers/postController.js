const { postValidation, commentValidation } = require("../authValidation/validation");
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");


async function createPost (req, res) {
  try{
    const { error } = await postValidation(req.body);

    if (error) {
      return res.status(400).send({ error: "Post validation failed" });
    }

    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }

    const { title, desc } = req.body;
    const { _id } = req.user;

    const post = {
      user: _id,
      title: title,
      desc: desc,
      created_at: new Date().toUTCString(),
    };

    const newPost = await Post.create(post);
    user.posts.push(newPost._id);
    await user.save();

    return res.status(201).send({
      postID: newPost._id,
      title: newPost.title,
      desc: newPost.desc,
      created_at: newPost.created_at,
    });
  }

  catch (err) {
    return res.status(500).send({ error: "Invalid Request (createPost)" });
  }
};


async function deletePost(req, res) {
  try{
    const user = await User.findById({ _id: req.user._id });
    const post = await Post.findById({ _id: req.params.id });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (!post) {
      return res.status(404).send({ error: "Post does not exist" });
    }

    if (post.user.toString() !== user._id.toString()) {
      return res.status(403).send({ message: "Cannot Delete Post, Becoz you did not created it" });
    } 

    await Post.deleteOne({ _id: post._id });

    user.posts.remove(post._id);
    await user.save();

    return res.status(202).send({ message: "Post Deleted" });
  }

  catch(err){
    return res.status(500).send({ error: "Invalid Request (deletePost)" });
  }
};


async function allPostsByUser(req, res) {
  try{
    const user = await User.findOne({ _id: req.user._id })
      .populate({
        path: "posts",
        populate: {
          path: "comments",
          model: "Comment",
        },
      })
      .exec();

    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }

    let userPosts = [];

    user.posts.map((post) => {
      const postData = {
        id: post._id,
        title: post.title,
        desc: post.desc,
        created_at: post.created_at,
        comments: post.comments,
        likes: post.likes.length,
      };

      userPosts.push(postData);
    });

    return res.send({ posts: userPosts });
  }

  catch(err){
    return res.status(500).send({ error: "Invalid Request (allPostsByUser)" });
  }
};


async function singlePost(req, res) {
  try {
    const post = await Post.findOne({ _id: req.params.id })
      .populate("comments")
      .exec();

    if (!post) {
      return res.status(404).send({ message: "post does not exist" });
    }

    const postData = {
      id: post._id,
      title: post.title,
      desc: post.desc,
      created_at: post.created_at,
      comments: post.comments,
      likes: post.likes.length,
    };

    return res.status(200).send({ postData });
  } 
  
  catch (err) {
    return res.status(500).send({ error: "Invalid request (SinglePost)" });
  }
};


async function like (req, res) {
  try {
    const post = await Post.findById({ _id: req.params.id });

    if (!post) {
      return res.status(404).send({ error: "Post does not exist" });
    }

    if (post.likes.includes(req.user._id)) {
      return res.status(400).send({ message: "Post already liked" });
    }
  
    post.likes.push(req.user._id);
    await post.save();

    return res.status(200).send({message: "Post liked"});
  } 
  
  catch (err) {
    return res.status(500).send({ error: "Invalid request (LikePost)" });
  }
};


async function unlike(req, res) {
  try {
    
    const post = await Post.findById({ _id: req.params.id });

    if (!post) {
      return res.status(404).send({ message: "Post does not exist" });
    }

    if (!post.likes.includes(req.user._id)) {
      return res.status(400).send({ message: "Post not liked, so cannot be unliked" });
    }
      
    post.likes.remove(req.user._id);
    await post.save();

    return res.status(200).send({message: "Post unliked" });
  } 
  
  catch (err) {
    return res.status(500).send({ error: "Invalid request (Unlike Post)" });
  }
};


async function comment(req, res) {

  try {
    const post = await Post.findById({ _id: req.params.id });

    if (!post) {
      return res.status(404).send({ error: "Post does not exist" });
    }

    const { error } = await commentValidation(req.body);

    if (error) {
      return res.status(400).send({ error: "Comment validation failed" });
    }

    const comment = await Comment.create({
      comment: req.body.comment,
      user: req.user._id,
    });

    post.comments.push(comment);
    await post.save();

    return res.status(201).send({message: "Comment added", commentId: comment._id,});
  } 
  
  catch (err) {
    return res.status(500).send({ error: "Invalid request (Comment)" });
  }
};


module.exports = {
  createPost,
  deletePost,
  allPostsByUser,
  singlePost,
  like,
  unlike,
  comment
}
