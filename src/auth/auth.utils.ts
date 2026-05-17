import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

/**
 * HASH PASSWORD
 */
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

/**
 * COMPARE PASSWORD
 */
export const comparePassword = async (
  password: string,
  hash: string
) => {
  return bcrypt.compare(password, hash);
};

/**
 * GENERATE TOKEN
 */
export const generateToken = (user: {
  id: number;
  email: string;
  role: string;
}) => {
  const secret: Secret = process.env.JWT_SECRET as string;

  const options: SignOptions = {
    expiresIn: "1d",
  };

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    options
  );
};