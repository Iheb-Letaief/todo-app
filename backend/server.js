import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { connectDB } from "./db-connector.js";
import authRoutes, {authenticate} from "./auth/authRoutes.js";
import fastifyJwt from "fastify-jwt";
import todoRoutes from "./routes/todoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

// Initialize Fastify
const fastify = Fastify({ logger: true });

// Connect to MongoDB
connectDB().then(r => console.log(r));

// Register Middleware
fastify.register(cors, {
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: "*",
});

fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    sign: { expiresIn: "5d" }
});

fastify.decorate("authenticate", authenticate)

// Register Routes
fastify.register(authRoutes, { prefix: "/api/auth" });
fastify.register(todoRoutes, { prefix: "/api" });
fastify.register(adminRoutes, { prefix: "/api/admin" });


// Start Server
const start = async () => {
    try {
        await fastify.listen({ port: 5000 });
        console.log("Server running on http://localhost:5000");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start().then(r => console.log(r));
