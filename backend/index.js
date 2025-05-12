const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const User = require("./models/users"); 
const config = require("./config.json");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const url = `mongodb+srv://${config.username}:${config.userpassword}@${config.clustername}.${config.userstring}.mongodb.net/${config.dbname}?retryWrites=true&w=majority&appName=${config.clustername}`;
mongoose
  .connect(url)
  .then(async () => {
    console.log("DB Connected");

    const adminEmail = "admin@admin.com";
    const adminPassword = "admin123";

    try {
     
      const existingAdmin = await User.findOne({ roles: "admin" });
      if (!existingAdmin) {
       
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        console.log("Hashed Admin Password:", hashedPassword); // Debugging log

      
        const admin = new User({
          name: "Admin User",
          email: adminEmail,
          password: hashedPassword,
          roles: "admin",
          forms: [],
        });
        await admin.save();
        console.log("Admin account created with email:", adminEmail);
      } else {
        console.log("Admin account already exists");
        console.log("Existing Admin Password:", existingAdmin.password); // Debugging log
      }
    } catch (error) {
      console.error("Error preloading admin:", error);
    }
  })
  .catch((err) => console.log("Error connecting to DB:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));


app.use(express.static(path.join(__dirname, "../frontend/views")));


app.get("/", (req, res) => {
  res.render("index");
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));