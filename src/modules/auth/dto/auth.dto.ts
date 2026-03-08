export interface LoginDto {
  email: string;
  password: string;
  tenantId: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  tenantId: string;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string;
  };
}
