import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { Logger } from '../utils/log4js'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.getArgByIndex(1).req

    return next.handle().pipe(
      map((data) => {
        const logFormat = {
          httpType: 'Response',
          ip: req.headers?.remoteip ? String(req.headers.remoteip) : req.ip.split(':').pop(),
          reqUrl: `${req.headers.host}${req.originalUrl}`,
          reqMethod: req.method,
          params: req.params,
          query: req.query,
          body: req.body,
          // data: data
        }

        Logger.access(JSON.stringify(logFormat))

        return {
          code: 0,
          data,
          message: null,
        }
      })
    )
  }
}
