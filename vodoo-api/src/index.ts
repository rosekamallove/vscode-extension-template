import express from "express";
import admin from "firebase-admin";

const serviceAccount = require("../ServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

(async () => {
  const app = express();

  const todos: Array<{ text: string; completed: boolean }> = [
    { text: "one", completed: false },
    { text: "two", completed: true },
    { text: "three", completed: false },
    { text: "four", completed: false },
  ];

  db.collection("users").doc("rosekamallove").set({
    todos,
  });

  app.get("/", (req, res) => {
    res.send("hello");
  });

  app.listen(3001, () => {
    console.log("listening on 3001");
  });
})();
