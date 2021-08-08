import express from "express";

(async () => {
  const app = express();

  app.get("/", (req, res) => {
    res.send("hello");
  });

  app.listen(3001, () => {
    console.log("listening on 3001");
  });
})();
