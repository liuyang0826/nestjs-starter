import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Logger } from '../utils/log4js'
import Ret from '../utils/ret'

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest()
    const response = host.switchToHttp().getResponse()
    const status = exception instanceof HttpException ? exception.getStatus() : -1

    // 自定义异常结构体, 日志用
    const data = {
      timestamp: new Date().toISOString(),
      ip: request.ip,
      reqUrl: request.originalUrl,
      reqMethod: request.method,
      httpCode: status,
      params: request.params,
      query: request.query,
      body: request.body,
      statusCode: exception.response?.errorCode ?? -1,
      errorMsg: exception.message,
      errorData: exception.response?.data ?? null,
      errorInfo: exception.response ?? exception,
    }

    Logger.error(data)

    if (exception instanceof HttpException) {
      response.status(status).send(exception.message)
    } else {
      response.status(status).json(Ret.fail())
    }
  }
}
