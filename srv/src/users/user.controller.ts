import { UserService } from './users.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { UsersResponseDto } from './users.response.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getUsersByPage(@Query() params: any) {
    this.logger.log('Get all users');
    const users = await this.userService.findByPage(params?.page);
    const pagesCount = await this.userService.getPagesCount();
    return {
      users: users.map((user) => UsersResponseDto.fromUsersEntity(user)),
      pagesCount,
    };
  }
}
