export interface CreateUserDto {
  name: string;
  email: string;
  tenantId: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}
