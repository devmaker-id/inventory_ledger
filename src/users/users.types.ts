export interface UserQuery {
  page?: string;
  limit?: string;
  search?: string;
}

export interface UpdateUserBody {
  name?: string;
  phone?: string;
  address?: string;
}