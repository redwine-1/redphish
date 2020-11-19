import express from "express";
import User from "../database/db.js";
import { Credential, Token } from "../database/db.js";

const { Router } = express;
const router = Router();

router.get("/redirect-url", (req, res) => {
  res.render("redirect", { user: req.user });
});
router.get("/documentation", (req, res) => {
  res.send("its in development stage.");
});
router.post("/redirect-url", (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { redirectURL: req.body.redirectUrl } },
    () => {
      res.redirect("/user/redirect-url");
    }
  );
});
router.get("/user-credentials", (req, res) => {
  Credential.find({ code: req.user.code }, (err, credentials) => {
    if (err) {
      console.log(err);
    } else if (credentials) {
      res.render("credentials", { credentials: credentials });
    }
  });
});

export default router;
