import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import jwt from "jsonwebtoken";

// inicjujemy klienta Prismy i OAuth2
const prisma = new PrismaClient();
const authClient = new OAuth2Client();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { idToken } = req.body;

    try {
      // weryfikujemy czy token ID jest na pewno poprawny
      const payload = await verifyIdToken(idToken);
      const userId = payload.sub;
      const userEmail = payload.email;

      let user = await prisma.user.findFirst({
        where: {
          authProviderId: userId,
        },
      });

      // jeżeli użytkownik nie istnieje, tworzymy go
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: userEmail!,
            authProviderId: userId,
          },
        });
      }

      // generujemy token JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ message: "Login failed" });
    }
  }
}

async function verifyIdToken(idToken: string): Promise<TokenPayload> {
  // ta walidacja jest rekomendowana przez Google dla zwiększenia bezpieczeństwa,
  // ponieważ ID token mógł zostać zmieniony po stronie klienta
  const ticket = await authClient.verifyIdToken({
    idToken: idToken,
    audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Invalid token");
  }

  return payload;
}
