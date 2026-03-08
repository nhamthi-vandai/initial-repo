import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto/user.dto';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(tenantId: string): Promise<UserResponseDto[]> {
    return this.userRepository.findAll(tenantId);
  }

  async getUserById(id: string, tenantId: string): Promise<UserResponseDto | null> {
    return this.userRepository.findById(id, tenantId);
  }

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    return this.userRepository.create(dto);
  }

  async updateUser(
    id: string,
    tenantId: string,
    dto: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    return this.userRepository.update(id, tenantId, dto);
  }

  async deleteUser(id: string, tenantId: string): Promise<boolean> {
    return this.userRepository.delete(id, tenantId);
  }
}
