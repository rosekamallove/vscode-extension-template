import cors from "cors";
import express from "express";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import { isAuth } from "./isAuth";
require("dotenv-safe");
require("dotenv").config();

const serviceAccount = require("../ServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
let User: any;

(async () => {
  const app = express();
  passport.serializeUser((user: any, done) => {
    done(null, user.accesToken);
  });

  app.use(cors({ origin: "*" }));
  app.use(passport.initialize());
  app.use(express.json());

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/auth/github/callback",
      },
      (_, __, profile, cb) => {
        console.log(profile);
        cb(null, {
          accesToken: jwt.sign(
            { userId: profile.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1y" }
          ),
        });
      }
    )
  );

  app.get("/auth/github", passport.authenticate("github", { session: false }));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    (req: any, res) => {
      res.redirect(`http://localhost:54321/auth/${req.user.accesToken}`);
    }
  );

  app.get("/me", async (req, res) => {
    /* Bearer skdjfalsfkajsf */
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.send({ user: null });
      return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.send({ user: null });
      return;
    }

    let userId = "";
    try {
      const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      userId = payload.userId;
    } catch (err) {
      res.send({ user: null });
      return;
    }
    User = db.collection("users").doc(userId);
    User.set(
      {
        name: "Rose Kamal Love",
        userId,
      },
      { merge: true }
    );
    const userData = await User.get();
    const user = userData.data();
    res.send({ user });
  });

  app.post("/todo", isAuth, async (req: any, _res) => {
    const todo = { text: req.body.text, completed: req.body.completed };
    db.collection("users")
      .doc(req.userId)
      .update({
        todos: admin.firestore.FieldValue.arrayUnion(todo),
        userId: req.userId,
      });
    _res.send({ todo });
  });

  app.put("/todo-update", isAuth, async (req: any, _res) => {
    const todo = { text: req.body.text, completed: req.body.completed };
    db.collection("users")
      .doc(req.userId)
      .update({
        todos: admin.firestore.FieldValue.arrayUnion(todo),
        userId: req.userId,
      });
    _res.send({ todo });
  });

  app.get("/", (_req, res) => {
    res.send("hello");
  });

  app.listen(3001, () => {
    console.log("listening on http://localhost:3001");
  });
})();
