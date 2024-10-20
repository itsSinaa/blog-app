import { User } from "@/types/auth";
import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "@/lib/client";

export const hashPassword = async (userpassword: string) => {
  const hashedPassword = await hash(userpassword, 12);
  return hashedPassword;
};

export const verifyPassword = async (
  userpassword: string,
  hashedPassword: string
) => {
  const verified = await compare(userpassword, hashedPassword);
  return verified;
};

export const generateToken = (data) => {
  const token = sign({ ...data }, process.env.JWT_SECRET!, {
    expiresIn: "360h",
  });
  return token;
};

export const isAuthenticated = async (): Promise<User | boolean> => {
  try {
    const userToken = cookies().get("token")?.value;

    if (!userToken) {
      return false;
    }

    const validatedToken = verify(userToken, process.env.JWT_SECRET!);

    if (!validatedToken) {
      return false;
    }

    const tokenOwner = await prisma.user.findFirst({
      where: {
        email: {
          equals: validatedToken.email,
          mode: "insensitive",
        },
      },
      select: {
        username: true,
        email: true,
        role: true,
      },
    });

    if (!tokenOwner) {
      return false;
    }

    return tokenOwner;
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    return false;
  }
};

export const getUserID = async () => {
  const userPayload = await isAuthenticated();

  const userID = prisma.user.findFirst({
    where: {
      AND: [
        {
          email: userPayload.email,
        },
        {
          username: userPayload.username,
        },
      ],
    },
    select: {
      id: true,
    },
  });

  return userID;
};
