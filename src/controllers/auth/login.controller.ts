import { FastifyRequest, FastifyReply } from "fastify";
import { LoginBody } from "../../utils/interfaces.js";
import jsonwebtoken from "jsonwebtoken";
import { prisma } from "../../utils/prisma.js";
import { ERROR500, ERROR401, STANDARD } from "../../utils/constants.js";
import 'dotenv/config';
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
import { comparePassword } from "../../utils/hash.js";

export const login = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) => {
  try {
    console.log("Login route hit!");
    const { body } = req;
    const { email, password } = body;
    const userDetails = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });
    if(!userDetails){
        return reply.code(ERROR401.statusCode).send({ message: 'User not found!' });
    }
    const isUser = await comparePassword(userDetails?.password, password);
    if(!isUser){
        return reply.code(ERROR401.statusCode).send({ message: 'Invalid credentials!' });
    }
    const payload = {
        email: userDetails?.email,
        userId: userDetails?.id,
    }
    const secret = ACCESS_TOKEN_SECRET;
    const refreshSecret = REFRESH_TOKEN_SECRET;
    if(!secret || !refreshSecret){
        return reply.code(ERROR500.statusCode).send({ message: 'Something went wrong!' });
    }
    const accessToken = jsonwebtoken.sign(payload, secret, { expiresIn: "15m" });
    const refreshToken = jsonwebtoken.sign(payload, refreshSecret, { expiresIn: "7d" });
    if (refreshToken){
        const token = await prisma.token.create({
            data: {
                userId: userDetails?.id,
                refreshToken: refreshToken
            }
        })
    }
    return reply.setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/refresh",
        maxAge: 7 * 24 * 60 * 60,
    }).send({
      code: STANDARD.SUCCESS,
      message: 'User found!',
      data: accessToken,
    });

  } catch (err: any) {
    return reply
      .code(ERROR500.statusCode)
      .send({ ...ERROR500, ...{ message: err.message } });
  }
};