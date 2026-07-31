const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const app = require("./app");
const mongoose = require("mongoose");
const User = require("./model/user");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(async () => {
    console.log("Connected to DB");

    const superAdmin = await User.findOne({
      email: process.env.SUPERADMIN_EMAIL,
    });

    if (!superAdmin) {
      await User.create({
        name: process.env.SUPERADMIN_NAME,
        email: process.env.SUPERADMIN_EMAIL,
        password: process.env.SUPERADMIN_PASSWORD,
        role: "superAdmin",
      });
      console.log("Super Admin Created!");
    }
  })
  .catch((err) => console.log("DB Connection Error:", err));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port: ${process.env.PORT || 3000}`);
});

module.exports = app;
