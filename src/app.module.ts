import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import config from './mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(config), AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
