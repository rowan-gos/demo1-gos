import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Role } from '@/common/enums/role.enum';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'john@gmail.com',
      firstName: 'john',
      lastName: 'doe',
      phone: '1234567890',
      password: '$2b$10$eXOwRvGh5GNGKL06dwsFDeUb.85C4jn/t2MXS7aFWfpVTSh.e4Omy',
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User,
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'maria@gmail.com',
      firstName: 'maria',
      lastName: 'smith',
      phone: '0987654321',
      password: '$2b$10$jFKxgkn5Ig9cSBWt2wwy4e1zy0deaUl3KCN9N6/5QKS4d4Um6xRI6',
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User,
  ];

  async findOne(email: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.email === email));
  }
  async findById(id: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((user) => user.id === id));
  }
  async create(user: User): Promise<User> {
    this.users.push(user);
    return Promise.resolve(user);
  }
}
