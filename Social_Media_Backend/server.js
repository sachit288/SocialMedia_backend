require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/connectDb.js");

const userController = require("./controllers/userController.js");
const postController = require("./controllers/postController.js");
const { verification } = require("./authValidation/verification.js");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

connectDB();

// Routes (API Endpoints)
// User routes
app.post("/api/authenticate", userController.authenticate);

app.get("/api/user", verification, userController.singleUser);

app.post("/api/follow/:id", verification, userController.follow);

app.post("/api/unfollow/:id", verification, userController.unfollow);


// Post routes
app.post("/api/posts", verification, postController.createPost);

app.get("/api/all_posts", verification, postController.allPostsByUser);

app.get("/api/posts/:id", postController.singlePost);

app.delete("/api/posts/:id", verification, postController.deletePost);

app.post("/api/like/:id", verification, postController.like);

app.post("/api/unlike/:id", verification, postController.unlike);

app.post("/api/comment/:id", verification, postController.comment);


// Home route
app.get("/", (req, res) => {
  const response = {
    success: "Hurray! Server Running",
    Routes: [
      {
        UserRoutes: [
          {
            authenticate: "api/authenticate",
            singleUser: "api/user",
            follow: "api/follow/:id",
            unfollow: "api/unfollow/:id"
          }
        ],
        PostRoutes: [
          {
            createPost: "api/posts",
            allPostsByUser: "api/all_posts",
            singlePost: "api/posts/:id",
            deletePost: "api/posts/:id",
            like: "api/like/:id",
            unlike: "api/unlike/:id",
            comment: "api/comment/:id"
          }
        ]
      }
    ]
  };

  const formattedResponse = JSON.stringify(response, null, 3);
  const htmlResponse = `<pre>${formattedResponse}</pre>`;

  res.send(htmlResponse);
});



app.listen(3000 || process.env.PORT, () => {
  console.log(`App Started`);
});
