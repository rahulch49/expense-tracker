import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      userId: number;
      name: string;
      iat?: number;
      exp?: number;
    };
  }
}
