import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import fastify from "fastify";
import crypto from "crypto";
import {renderPasswordResetEmail, sendEmail} from "./services/emailService.js";


dotenv.config();

const resetTokens = {};

export default async function authRoutes(fastify, options) {
    // User signup
    fastify.post("/signup", async (req, reply) => {
        try {
            const { name, email, password, role } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return reply.status(400).send({ message: "Email already registered" });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const user = new User({
                name,
                email,
                password: hashedPassword,
                role: role === 'admin' ? 'admin' : 'user',
            });

            await user.save();
            return reply.status(201).send({ message: "User registered successfully" });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ message: "Server error" });
        }
    });

    // User login
    fastify.post("/login", async (req, reply) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return reply.status(400).send({ message: "Invalid credentials" });
            }

            const token = fastify.jwt.sign(
                { id: user._id, role: user.role },
                { expiresIn: "5d" }
            );

            return reply.send({
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
                token, // Access token for API calls
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ message: "Server error" });
        }
    });

    // Protected Route Example (For Testing)
    fastify.get("/me", { preValidation: [fastify.authenticate] }, async (req, reply) => {
        return reply.send({ user: req.user });
    });

    // Request Password Reset
    fastify.post("/reset-password", async (req, reply) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return reply.status(400).send({ message: "User not found" });
            }

            // Generate reset token
            const token = crypto.randomBytes(32).toString("hex");
            resetTokens[token] = { email, expires: Date.now() + 15 * 60 * 1000 }; // Expires in 15 minutes

            // Render and send reset email
            const resetLink = `${process.env.FRONTEND_URL}/login/reset-password?token=${token}`;
            const emailHtml = renderPasswordResetEmail({ resetLink });

            await sendEmail(email, "Password Reset Request - TodoApp", emailHtml);

            return reply.send({ message: "Password reset email sent" });
        } catch (error) {
            console.error("Reset password error:", error);
            return reply.status(500).send({ message: "Server error" });
        }
    });

    // Update Password
    fastify.post("/update-password", async (req, reply) => {
        try {
            const { token, newPassword } = req.body;

            if (!resetTokens[token] || resetTokens[token].expires < Date.now()) {
                return reply.status(400).send({ message: "Invalid or expired token" });
            }

            const { email } = resetTokens[token];
            const user = await User.findOne({ email });

            if (!user) {
                return reply.status(400).send({ message: "User not found" });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            // Delete used token
            delete resetTokens[token];

            return reply.send({ message: "Password updated successfully" });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ message: "Server error" });
        }
    });

}

export async function authenticate(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader ||!authHeader.startsWith('Bearer ')) throw new Error("No token provided");

        const token = authHeader.split(" ")[1];
        request.user = await request.jwtVerify();
    } catch (error) {
        return reply.status(401).send({ message: "Unauthorized" });
    }
}

