import { FastifyRequest, FastifyReply } from "fastify";
import { SignupBody } from "../../utils/interfaces.js";
import { prisma } from "../../utils/prisma.js";
import { ERROR500 } from "../../utils/constants.js";
import 'dotenv/config';
import { hashPassword } from "../../utils/hash.js";

export const signup = async (
  req: FastifyRequest<{ Body: SignupBody }>,
  reply: FastifyReply
) => {
  try {
    const { body } = req;
    const { name, email, phone, password } = body;
    console.log(name, email, phone, password);
    const hashed: string = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashed,
      },
    });
    return {
      message: "Signup route hit!",
      data: newUser,
    };
  } catch (err: any) {
    console.log("err", err);
    return reply
      .code(ERROR500.statusCode)
      .send({ ...ERROR500, ...{ message: err.message } });
  }
};