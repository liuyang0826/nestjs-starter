import { Controller, Get } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('api/user')
export class UserController {
  constructor(private userSerive: UserService) {}

  @Get()
  findAll() {
    return this.userSerive.findAll()
  }
}
