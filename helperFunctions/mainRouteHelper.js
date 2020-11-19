import shortid from "shortid";
import User, { Token } from "../database/db.js";
import sendMail from "../mail.js";

function registerPost(req, res) {
  const token = Math.floor(Math.random() * 10000000);
  Token.create({
    userId: req.user._id,
    token: token,
  });
  sendMail(String(token), req.user.username);
  User.findByIdAndUpdate(req.user._id, { code: shortid.generate() }, () => {
    res.redirect("/user");
  });
}
function verifyCheck(render, user, res) {
  if (!user.isVerified) {
    res.render("verify", { email: user.username });
  } else if (user.isVerified) {
    res.render(render);
  }
}

export { registerPost, verifyCheck };
