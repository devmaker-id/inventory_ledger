// import "express";

// declare module "express-serve-static-core" {
//   interface Request {
//     user?: {
//       userId: number;
//       email: string;
//       role: string;
//     };
//   }
// }

import { JwtPayload } from "../auth/auth.types.ts";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload
    }
  }
}

export {};