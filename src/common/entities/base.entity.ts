import * as crypto from 'node:crypto';
import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string = crypto.randomUUID();

  @Property({ type: 'timestamptz', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamptz',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
