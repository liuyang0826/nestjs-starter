import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import database from './config/database'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [TypeOrmModule.forRoot(database), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
