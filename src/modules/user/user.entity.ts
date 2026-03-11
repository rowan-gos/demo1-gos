import { BeforeCreate, Entity, Enum, Property } from '@mikro-orm/core';
import { promisify } from 'node:util';
import * as crypto from 'node:crypto';
import { BaseEntity } from '@/common/entities/base.entity';
import { Role } from '@/common/enums/role.enum';
import { UserRepository } from './user.repository';
import { Role } from '@/common/enums/role.enum';
const scrypt = promisify(crypto.scrypt);

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  @Property({ type: 'varchar', length: 255 })
  firstName!: string;

  @Property({ type: 'varchar', length: 255 })
  lastName!: string;

  @Property({ type: 'varchar', length: 255 })
  email!: string;

  @Property({ type: 'varchar', length: 20 })
  phone!: string;

  @Property({ type: 'varchar', length: 255 })
  password!: string;

  @Property({ nullable: true })
  avatarUrl?: string;

  @Enum(() => Role)
  role: Role = Role.USER;

  @BeforeCreate()
  async hashPassword() {
    const salt = crypto.randomBytes(16).toString('hex');
    const key = (await scrypt(this.password, salt, 64)) as Buffer;
    this.password = `${salt}:${key.toString('hex')}`;
  }
}
