import { BeforeCreate, Entity, Property } from '@mikro-orm/core';
import { promisify } from 'node:util';
import * as crypto from 'node:crypto';
import { BaseEntity } from '@/common/entities/base.entity';

const scrypt = promisify(crypto.scrypt);

@Entity()
export class Admin extends BaseEntity {
  @Property({ type: 'varchar', length: 255 })
  name!: string;

  @Property({ type: 'varchar', length: 255 })
  email!: string;

  @Property({ type: 'varchar', length: 255 })
  password!: string;

  @Property({ nullable: true })
  avatar_url?: string;

  @BeforeCreate()
  async hashPassword() {
    const salt = crypto.randomBytes(16).toString('hex');
    const key = (await scrypt(this.password, salt, 64)) as Buffer;
    this.password = `${salt}:${key.toString('hex')}`;
  }
}
