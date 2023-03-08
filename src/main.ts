import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AnyExceptionFilter } from './common/filters/any-exception.filter'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new AnyExceptionFilter())

  await app.listen(3000)
}

bootstrap()
