import { Controller, Get } from '@nestjs/common'
import Ret from '../../common/utils/ret'
import { UserService } from './user.service'

@Controller('api/user')
export class UserController {
  constructor(private userSerive: UserService) {}

  @Get()
  findAll() {
    return Ret.ok(this.userSerive.findAll())
  }
}
