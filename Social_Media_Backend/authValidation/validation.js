const Joi = require("joi");

const userValidation = async (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).with("email", "password");

  return schema.validate({ email: user.email, password: user.password });
};


const postValidation = async (post) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
  }).with("title", "desc");

  return schema.validate({ title: post.title, desc: post.desc });
};


const commentValidation = async (comment) => {
  const schema = Joi.object({
    comment: Joi.string().required(),
  });

  return schema.validate({ comment: comment.comment });
};


module.exports = { userValidation, postValidation, commentValidation };
