import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  provider: String,
  providerID: String,
  name: { type: String, required: true },
  picture: String,
  redirectURL: {
    type: String,
    default: "https://www.facebook.com/PoojaBroom/videos/253266032595533/",
  },
  code: String,
  isVerified: { type: Boolean, required: true, default: false },
});

const credentialSchema = new mongoose.Schema({
  userName: String,
  passcode: String,
  code: String,
  created_date: {
    type: Date,
    default: Date.now,
  },
});

const tokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: { expires: "1d", unique: true },
  },
});

const Credential = mongoose.model("Credential", credentialSchema);
const Token = mongoose.model("Token", tokenSchema);
userSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", userSchema);
export { Credential, Token };
