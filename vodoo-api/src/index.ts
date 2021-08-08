import express from "express";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
require("dotenv-safe");
require("dotenv").config();

const serviceAccount = require("../ServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
let User;

const todos: Array<{ text: string; completed: boolean }> = [
  { text: "five", completed: false },
  { text: "six", completed: false },
  { text: "seven", completed: false },
  { text: "eight", completed: false },
];

(async () => {
  const app = express();
  passport.serializeUser((user: any, done) => {
    done(null, user.accesToken);
  });

  app.use(passport.initialize());

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3001/auth/github/callback",
      },
      (_, __, profile, cb) => {
        console.log(profile);
        cb(null, {
          accesToken: jwt.sign(
            { userId: profile.id },
            "aksdfjasdfsdifrifieowmcei",
            { expiresIn: "1y" }
          ),
        });
        User = db.collection("users").doc(profile.id);
        User.set({
          todos,
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

  app.get("/", (_req, res) => {
    res.send("hello");
  });

  app.listen(3001, () => {
    console.log("listening on 3001");
  });
})();
