import { FastifyInstance } from "fastify";
// import { signup, login } from "../controllers/auth.controller.js";
import { signup, login } from "../controllers/index.js"

export const authRoutes = (app: FastifyInstance) => {
    app.post("/signup", signup);
    app.post("/login", login);
}