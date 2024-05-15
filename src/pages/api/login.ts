// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();
const authClient = new OAuth2Client();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { idToken } = req.body;

    try {
      const ticket = await authClient.verifyIdToken({
        idToken: idToken,
        audience:
          "679975214581-ibtp5leaap1qgcmdvg5flb8aop4g73jh.apps.googleusercontent.com",
      });
      const payload = ticket.getPayload();

      if (!payload || !payload["sub"] || !payload["email"]) {
        throw new Error("Invalid token");
      }

      const userId = payload["sub"];
      const userEmail = payload["email"];

      let user = await prisma.user.findFirst({
        where: {
          authProviderId: userId,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: userEmail,
            authProviderId: userId,
          },
        });
      }

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Login failed" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
