const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  forms:[{type:mongoose.Schema.ObjectId,ref:'Form'}]
});


userSchema.pre("save", async function (next) {
 
  if (!this.isModified("password")) return next();

  const isHashed = this.password.startsWith("$2b$");
  console.log("Is Password Already Hashed:", isHashed); 
  if (isHashed) return next();

 
  this.password = await bcrypt.hash(this.password, 10);
  console.log("Password Hashed in Middleware:", this.password); 
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);