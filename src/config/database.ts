import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DatabaseLogger } from '../common/utils/log4js'

const database: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '',
  database: 'nestjs',
  synchronize: true,
  logging: true,
  logger: new DatabaseLogger(),
  timezone: '+08:00',
  autoLoadEntities: true,
}

export default database
