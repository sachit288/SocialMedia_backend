const { userValidation } = require("../authValidation/validation");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();


async function authenticate (req, res) {
  try {
    let { email, password } = req.body;

    const { error } = await userValidation(req.body);

    if (error) {
      return res.status(400).send({ error: "User validation failed" });
    }

    const user = await User.findOne({ email });

    if (user) {
      if (user.password === password) {
        
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

        return res.status(200).header({ token: token }).send({ token: token });
      } 
      
      else {
        return res.status(401).send({ error: "Incorrect password" });
      }
    } 
    

    let { userName } = req.body;
    if (!userName) {
      userName = "Name not given";
    }

    const tempUser = { userName, email, password };
    const newUser = await User.create(tempUser);
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET_KEY);

    return res.status(201).header({ token: token }).send({ token: token });
  } 
  
  catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Invalid Request (authenticate)" });
  }
};


async function singleUser (req, res) {
  try {
    const _id  = req.user;
    const user = await User.findOne({ _id });

    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }

    const userName = user.userName;
    const following = user.following.length;
    const followers = user.followers.length;

    return res.status(200).send({ userName, followers, following });
  } 
  
  catch (err) {
    return res.status(500).send({ error: "Invalid Request (Single Post)" });
  }
};


async function follow (req, res) {  
  try {
    const currentUser = await User.findById(req.user._id);
    const otherUser = await User.findById(req.params.id);

    if (!otherUser) {
      return res.status(404).send({ message: "User to be followed does not exist" });
    }

    if (req.user._id === req.params.id) {
      return res.status(400).send({ message: "Cannot follow self" });
    }

    if (currentUser.following.includes(otherUser._id)) {
      return res.status(200).send({ message: "Already following" });
    }
    
    currentUser.following.push(otherUser._id);
    await currentUser.save();

    otherUser.followers.push(currentUser._id);
    await otherUser.save();

    return res.status(200).send({ message: "User added to following list" });
  } 
  
  catch (err) {
    return res.status(500).send({ error: "Invalid Request (Follow)" });
  }
};


async function unfollow (req, res) {
  try {
    const currentUser = await User.findById(req.user._id);
    const otherUser = await User.findById(req.params.id);

    if (!otherUser) {
      return res.status(404).send({ message: "User to be UnFollowed does not exist" });
    }

    if (req.user._id === req.params.id) {
      return res.status(400).send({ message: "Cannot Unfollow self" });
    }

    if (!currentUser.following.includes(otherUser._id)) {
      return res.status(200).send({ message: "You dont follow this user, so cannot unfollow" });
    } 
      
    currentUser.following.remove(otherUser._id);
    await currentUser.save();

    otherUser.followers.remove(currentUser._id);
    await otherUser.save();

    return res.status(200).send({message: "User removed from following list"});
  } 
  
  catch (err) {
    return res.status(500).send({ error: "Invalid Request (UnFollow)" });
  }
};


module.exports = {
  singleUser,
  authenticate,
  follow,
  unfollow,
}
