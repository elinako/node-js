const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: String,
  password: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
});

UserSchema.statics.findUserByEmail = findUserByEmail;
UserSchema.statics.updateToken = updateToken;

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, { token: newToken });
}

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;
