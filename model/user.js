const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    image: { type: String },
    role: {
      type: String,
      enum: ["admin", "superAdmin", "user"],
      default: "user",
    },
    // isdeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.pre(/^find/, function () {
  if (!this.getOptions().includePassword) {
    this.select("-password");
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
