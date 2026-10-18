import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("A strong JWT_SECRET is required.");
  return secret;
}

export interface UserTokenPayload {
  userId: string;
  email: string;
  role: "customer" | "admin";
  name: string;
  phone?: string;
  orgId?: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: UserTokenPayload): string {
  return jwt.sign(payload, jwtSecret(), {
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

export function verifyToken(token: string): UserTokenPayload | null {
  try {
    return jwt.verify(token, jwtSecret(), {
      algorithms: ["HS256"],
    }) as UserTokenPayload;
  } catch {
    return null;
  }
}
