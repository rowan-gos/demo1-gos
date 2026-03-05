import { Migration } from '@mikro-orm/migrations';

export class Migration20260304110607 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "admin" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz not null, "avatar_url" varchar(255) null);`,
    );

    this.addSql(
      `create table "user" ("id" serial primary key, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz not null, "avatar_url" varchar(255) null);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "admin" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }
}
