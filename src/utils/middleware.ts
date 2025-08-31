import { FastifyRequest, FastifyReply } from "fastify";
import { ERROR400, ERROR401, ERROR403 } from "./constants.js";
import jwt from "jsonwebtoken";
const { ACCESS_TOKEN_SECRET } = process.env;
import { prisma } from "../utils/prisma.js";
export const middleWare = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.send({
        code: ERROR400.statusCode,
        message: "No token found!",
      });
    }
    if (!ACCESS_TOKEN_SECRET) {
      return reply.send({
        code: ERROR400.statusCode,
        message: "No access token secret found!",
      });
    }
    const token = authHeader.split(" ")[1];

    const jwtDetails: any = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > jwtDetails.exp) {
      return reply.send({
        code: ERROR403.statusCode,
        message: "Token expired",
      });
    }
    req.user = jwtDetails;
  } catch (err) {
    return reply.code(ERROR401.statusCode).send(ERROR401);
  }
};
