const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },  // 👈 Add this line
    password: { type: String, required: true },
    refreshToken: { type: String, default: null } 
});

module.exports = mongoose.model("User", UserSchema);
