import { FastifyInstance } from "fastify";
import { signup, login, refresh } from "../controllers/index.js"

export const authRoutes = (app: FastifyInstance) => {
    app.post("/signup", signup);
    app.post("/login", login);
    app.post("/refresh", refresh);
}