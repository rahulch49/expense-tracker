import { FastifyInstance } from "fastify";
import { signup } from "../controllers/auth.controller.js";

export const authRoutes = (app: FastifyInstance) => {
    app.post("/signup", signup);
}