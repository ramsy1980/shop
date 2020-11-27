import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Db, ObjectID } from 'mongodb';
import { User } from '../common/models';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService  {
  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

  async findOneByEmail(email: string) {
    const user = await this.db.collection('users').findOne({ email });
    if (user) {
      return new User(user);
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async findOneById(userId: string) {
    const user = await this.db.collection('users').findOne({ _id: new ObjectID(userId) });
    if (user) {
      return new User(user);
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async create(user: CreateUserDto): Promise<User> {
    const response = await this.db.collection('users').insertOne(user);

    return response.ops[0] as User;
  }
}
