import * as Path from 'path'
import * as Util from 'util'
import dayjs from 'dayjs'
import * as Log4js from 'log4js'
import * as StackTrace from 'stacktrace-js'
import log4jsConfig from '../../config/log4js'

// 定义日志级别
export enum LoggerLevel {
  ALL = 'ALL',
  MARK = 'MARK',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF',
}

// 内容跟踪类
export class ContextTrace {
  constructor(
    public readonly context: string,
    public readonly path?: string,
    public readonly lineNumber?: number,
    public readonly columnNumber?: number
  ) {}
}

// 添加用户自定义的格式化布局函数。 可参考: https://log4js-node.github.io/log4js-node/layouts.html
Log4js.addLayout('json', (logConfig: any) => {
  return (logEvent: Log4js.LoggingEvent): string => {
    let moduleName = ''
    let position = ''

    // 日志组装
    const messageList: string[] = []

    logEvent.data.forEach((value: any) => {
      if (value instanceof ContextTrace) {
        moduleName = value.context

        // 显示触发日志的坐标（行，列）
        if (value.lineNumber && value.columnNumber) {
          position = `${value.lineNumber}, ${value.columnNumber}`
        }

        return
      }

      if (typeof value !== 'string') {
        value = Util.inspect(value, false, 3, true)
      }

      messageList.push(value)
    })

    // 日志组成部分
    const messageOutput: string = messageList.join(' ')
    const positionOutput: string = position ? ` [${position}]` : ''
    const typeOutput = `[${logConfig.type}] ${logEvent.pid.toString()}   - `
    const dateOutput = `${dayjs(logEvent.startTime).format('YYYY-MM-DD HH:mm:ss')}`
    const moduleOutput: string = moduleName ? `[${moduleName}] ` : '[LoggerService] '
    let levelOutput = `[${logEvent.level}] ${messageOutput}`

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const chalk = require('chalk')

    // 根据日志级别，用不同颜色区分
    switch (logEvent.level.toString()) {
      case LoggerLevel.DEBUG:
        levelOutput = chalk.green(levelOutput)
        break
      case LoggerLevel.INFO:
        levelOutput = chalk.cyan(levelOutput)
        break
      case LoggerLevel.WARN:
        levelOutput = chalk.yellow(levelOutput)
        break
      case LoggerLevel.ERROR:
        levelOutput = chalk.red(levelOutput)
        break
      case LoggerLevel.FATAL:
        levelOutput = chalk.hex('#DD4C35')(levelOutput)
        break
      default:
        levelOutput = chalk.gray(levelOutput)
        break
    }

    return `${chalk.green(typeOutput)}${dateOutput}  ${chalk.yellow(moduleOutput)}${levelOutput}${positionOutput}`
  }
})

// 注入配置
Log4js.configure(log4jsConfig)

// 实例化
const logger = Log4js.getLogger('default')
const mysqlLogger = Log4js.getLogger('mysql') // 添加了typeorm 日志实例
logger.level = LoggerLevel.TRACE

// 定义log类方法
export class Logger {
  static trace(...args: any[]) {
    logger.trace(Logger.getStackTrace(), ...args)
  }

  static debug(...args: any[]) {
    logger.debug(Logger.getStackTrace(), ...args)
  }

  static log(...args: any[]) {
    logger.info(Logger.getStackTrace(), ...args)
  }

  static info(...args: any[]) {
    logger.info(Logger.getStackTrace(), ...args)
  }

  static warn(...args: any[]) {
    logger.warn(Logger.getStackTrace(), ...args)
  }

  static warning(...args: any[]) {
    logger.warn(Logger.getStackTrace(), ...args)
  }

  static error(...args: any[]) {
    logger.error(Logger.getStackTrace(), ...args)
  }

  static fatal(...args: any[]) {
    logger.fatal(Logger.getStackTrace(), ...args)
  }

  static access(...args: any[]) {
    const loggerCustom = Log4js.getLogger('http')
    loggerCustom.info(Logger.getStackTrace(), ...args)
  }

  // 日志追踪，可以追溯到哪个文件、第几行第几列
  // StackTrace 可参考 https://www.npmjs.com/package/stacktrace-js
  static getStackTrace(deep = 2): string {
    const stackList: StackTrace.StackFrame[] = StackTrace.getSync()
    const stackInfo: StackTrace.StackFrame = stackList[deep]
    const lineNumber: number = stackInfo.lineNumber
    const columnNumber: number = stackInfo.columnNumber
    const fileName: string = stackInfo.fileName
    const basename: string = Path.basename(fileName)

    return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`
  }
}

// 自定义typeorm 日志器, 可参考 https://blog.csdn.net/huzzzz/article/details/103191803/
export class DatabaseLogger implements Logger {
  logQuery(query: string) {
    mysqlLogger.info(query)
  }

  logQueryError(error: string, query: string) {
    mysqlLogger.error(query, error)
  }

  logQuerySlow(time: number, query: string) {
    mysqlLogger.info(query, time)
  }

  logSchemaBuild(message: string) {
    mysqlLogger.info(message)
  }

  logMigration(message: string) {
    mysqlLogger.info(message)
  }
  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'info': {
        mysqlLogger.info(message)
        break
      }

      case 'warn': {
        mysqlLogger.warn(message)
      }
    }
  }
}
