import { FastifyRequest, FastifyReply } from "fastify";
import { LoginBody } from "../../utils/interfaces.js";
import jsonwebtoken from "jsonwebtoken";
import { prisma } from "../../utils/prisma.js";
import { ERROR500, STANDARD, ERROR403 } from "../../utils/constants.js";
import 'dotenv/config';
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const refresh = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) => {
  try {
    console.log("Refresh route hit!");
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return reply.send({
            code: ERROR500.statusCode,
            message: "Refresh token not provided",
        })
    };
    if(!REFRESH_TOKEN_SECRET){
        return reply.send({
            code: ERROR500.statusCode,
            message: "Refresh token secret not found",
        })
    }
    const tokenDetails = await prisma.token.findUnique({
        where: {
            refreshToken: refreshToken,
            isActive: true,
        }
    });
    if(!tokenDetails) { 
        return reply.send({ code: ERROR403.statusCode, message: "Unauthorized" });
    }
    const verify: any = jsonwebtoken.verify(refreshToken, REFRESH_TOKEN_SECRET);
    // console.log('verify-->', verify);
    if (!verify){
        return reply.send({
            code: ERROR403.statusCode,
            message: "Unauthorized"
        })
    }
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > verify.exp) {
        await prisma.token.update({
            where: { refreshToken: refreshToken },
            data: { isActive: false }
        });

        return reply.send({
                code: ERROR403.statusCode,
                message: "Token expired"
            });
    };
    
    const userDetails = await prisma.user.findUnique({
        where: {
            id: tokenDetails?.userId,
        }
    });
    if(!ACCESS_TOKEN_SECRET) {
        return reply.send({
                code: ERROR403.statusCode,
                message: "Access Token Secret not found"
            });
    }
    const jwtToken = jsonwebtoken.sign({ name: userDetails?.name, userId: userDetails?.id }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" })

    return reply.send({
        code: STANDARD.SUCCESS,
        message: "Validated!",
        body: jwtToken
    })

  } catch (err: any) {
    return reply
      .code(ERROR500.statusCode)
      .send({ ...ERROR500, ...{ message: err.message } });
  }
};