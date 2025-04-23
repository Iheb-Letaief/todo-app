import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        language: { type: String, enum: ["en", "fr"], default: "en" },
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
