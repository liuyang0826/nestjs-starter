import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { Logger } from '../utils/log4js'

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next()

    // 组装日志信息
    const logFormat = {
      httpType: 'Request',
      ip: req.headers?.remoteip ? String(req.headers.remoteip) : req.ip.split(':').pop(),
      reqUrl: `${req.headers.host}${req.originalUrl}`,
      reqMethod: req.method,
      httpCode: res.statusCode,
      params: req.params,
      query: req.query,
      body: req.body,
    }

    // 根据状态码，进行日志类型区分
    if (res.statusCode >= 400) {
      Logger.error(JSON.stringify(logFormat))
    } else {
      Logger.access(JSON.stringify(logFormat))
    }
  }
}
