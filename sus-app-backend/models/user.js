const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    role: {
        type: String,
        enum: ["user", "admin", "seller"],
        default: "user"
    },
    refreshTokenHash: String,
    refreshTokenExpiresAt: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
