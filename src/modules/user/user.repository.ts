import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './user.entity';

export class UserRepository extends EntityRepository<User> {
  public async findByEmail(email: string): Promise<User | null> {
    return this.getEntityManager().findOne(User, { email });
  }

  public async findById(id: string): Promise<User | null> {
    return this.getEntityManager().findOne(User, { id });
  }

  public async createUser(user: User): Promise<User> {
    this.getEntityManager().persist(user);
    await this.getEntityManager().flush();
    return user;
  }

  public async updatePassword(id: string, newPassword: string): Promise<User> {
    const user = await this.getEntityManager().findOneOrFail(User, { id });
    user.password = newPassword;
    await this.getEntityManager().flush();
    return user;
  }

  public async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.getEntityManager().findOneOrFail(User, { id });
    this.getEntityManager().assign(user, data);
    await this.getEntityManager().flush();
    return user;
  }

  public async delete(id: string): Promise<void> {
    const user = await this.getEntityManager().findOneOrFail(User, { id });
    await this.getEntityManager().removeAndFlush(user);
  }

  public async getAll(limit?: number, offset?: number): Promise<User[]> {
    return this.getEntityManager().find(User, {}, { limit, offset });
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const count = await this.getEntityManager().count(User, { email });
    return count > 0;
  }

  public async existsById(id: string): Promise<boolean> {
    const count = await this.getEntityManager().count(User, { id });
    return count > 0;
  }

  public async count(): Promise<number> {
    return this.getEntityManager().count(User);
  }
}
