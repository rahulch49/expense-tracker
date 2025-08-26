import { FastifyRequest, FastifyReply } from "fastify";

export const signup = async (req: FastifyRequest, reply: FastifyReply) => {
    console.log("First console!");
    return {
        message: "Signup route hit!"
    }
}