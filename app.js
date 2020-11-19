import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import googleAuth from "passport-google-oauth20";
import User from "./database/db.js";
import mainRoute from "./routes/mainRoute.js";
import userRoute from "./routes/userRoute.js";
import shortid from "shortid";
import dotenv from "dotenv";
dotenv.config();

const { Strategy: GoogleStrategy } = googleAuth;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");

mongoose
  .connect(process.env.MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongo db"))
  .catch((error) => handleError(error));

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

passport.use(User.createStrategy());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: process.env.CALLBACKURL,
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne(
        {
          providerID: profile.id,
        },
        function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            const newUser = new User({
              providerID: profile.id,
              name: profile.displayName,
              isVerified: true,
              username: profile.emails[0].value,
              provider: "google",
              picture: profile.photos[0].value,
              code: shortid.generate(),
            });
            newUser.save(function (err, doc) {
              if (err) {
                console.log(err);
              }
              return done(err, doc);
            });
          } else {
            return done(err, user);
          }
        }
      );
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated() && req.user.isVerified) {
    return next();
  } else if (req.isAuthenticated() && !req.user.isVerified) {
    res.redirect("/user");
  } else res.redirect("/login");
};

app.use("/", mainRoute);
app.use(ensureAuthenticated);
app.use("/user", userRoute);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`listening to port ${port}`);
});
