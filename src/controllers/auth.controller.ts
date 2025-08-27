import { FastifyRequest, FastifyReply } from "fastify";
import * as bcrypt from "bcrypt";
import { ERROR500 } from "../utils/constants.js";
import { SignupBody } from "../utils/interfaces.js";
import { prisma } from "../utils/prisma.js";

export const signup = async (req: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
    try{
        const { body } = req;
        const { name, email, phone, password } = body;
        console.log(name, email, phone, password);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password
            }
        });
        console.log('user-->>', newUser);
        return {
        message: "Signup route hit!"
    }
    }
    catch (err: any){
        console.log('err', err);
        return reply.code(ERROR500.statusCode).send({...ERROR500, ...{message: err.message}});
    }
    
}