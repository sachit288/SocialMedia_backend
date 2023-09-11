const jwt = require("jsonwebtoken");

const verification = async (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    return res.status(404).send({ error: "Unauthorized User" });
  }

  const tokenWithoutPrefix = token.replace("Bearer ", "");

  try {
    const user = jwt.verify(tokenWithoutPrefix, process.env.JWT_SECRET_KEY);
    if (user) {
      req.user = user;
      next();
    }
  } 
  
  catch (err) {
    return res.status(401).send({ message: "Token not valid!" });
  }
};

module.exports = { verification };
