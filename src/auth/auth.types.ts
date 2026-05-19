export interface JwtPayload {
  id: number;
  email: string;
  role: string;
  parentId?: number | null;
}

export type LoginDTO = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;

  phone?: string;
  address?: string;

  role?: string;
}