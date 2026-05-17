import prisma from "../config/prisma.js";
import { 
  comparePassword,
  generateToken,
  hashPassword,
} from "./auth.utils.js";
import { 
  LoginDTO,
  LoginBody,
  RegisterBody,
} from "./auth.types.js";

export const loginService = async (data: LoginDTO) => {
  const { email, password } = data;

  // 1. cari user
  const user = await prisma.users.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // 2. cek password
  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    throw new Error("Invalid password");
  }

  // 3. generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role.name,
  });

  // 4. update last login
  await prisma.users.update({
    where: { id: user.id },
    data: {
      lastLogin: new Date(),
    },
  });

  // 5. return response clean
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    },
    token,
  };
};

/**
 * REGISTER SERVICE
 */
export const registerService = async (
  data: RegisterBody
) => {

  // 1. cek email sudah ada atau belum
  const existingUser = await prisma.users.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // 2. cari role
  const roleName = data.role || "RETAIL";

  const role = await prisma.role.findFirst({
    where: {
      name: roleName,
    },
  });

  if (!role) {
    throw new Error("Role not found");
  }

  // 3. hash password
  const hashedPassword = await hashPassword(
    data.password
  );

  // 4. create user
  const user = await prisma.users.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,

      phone: data.phone,
      address: data.address,

      roleId: role.id,
    },

    include: {
      role: true,
    },
  });

  // 5. generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role.name,
  });

  // 6. return response
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    },

    token,
  };
};