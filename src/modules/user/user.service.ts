import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findByEmail(email);
    return user || undefined;
  }
  async findById(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findById(id);
    return user || undefined;
  }
  async create(user: User): Promise<User> {
    return this.userRepository.createUser(user);
  }
}
