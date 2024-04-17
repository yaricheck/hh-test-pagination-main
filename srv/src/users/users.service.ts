import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

const RECORDS_BY_PAGE = 20;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepo.find();
  }

  async findByPage(page = 1): Promise<UsersEntity[]> {
    return await this.usersRepo.find({ skip: (page - 1) * RECORDS_BY_PAGE, take: RECORDS_BY_PAGE });
  }

  async getPagesCount(): Promise<number> {
    return Math.ceil((await this.usersRepo.count()) / RECORDS_BY_PAGE);
  }
}
