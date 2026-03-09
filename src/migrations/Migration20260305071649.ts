import { Migration } from '@mikro-orm/migrations';

export class Migration20260305071649 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "admin" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "avatar_url" varchar(255) null, constraint "admin_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null, "password" varchar(255) not null, "avatar_url" varchar(255) null, constraint "user_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "admin" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

}
