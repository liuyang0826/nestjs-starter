export default class Ret<T> {
  code: number
  data: T
  message: string
  constructor(code: number, data: T, message: string) {
    this.code = code
    this.data = data
    this.message = message
  }
  static async ok<T>(data: T) {
    return new Ret(0, await data, null)
  }
  static fail(message = '服务器内部错误', code = -1) {
    return new Ret(code, null, message)
  }
}
