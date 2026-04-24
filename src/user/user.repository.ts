import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, QueryFilter } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(usersFilterQuery: QueryFilter<User>): Promise<User[]> {
    return this.userModel.find(usersFilterQuery);
  }

  async findOne(userFilterQuery: QueryFilter<User>): Promise<User> {
    const user = await this.userModel.findOne(userFilterQuery);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async create(user: CreateUserDto): Promise<User> {
    const newUser = await this.userModel.create(user);
    return newUser.save();
  }

  async update(
    userFilterQuery: QueryFilter<User>,
    userUpdate: Partial<User>,
  ): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      userFilterQuery,
      userUpdate,
    );
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async remove(userFilterQuery: QueryFilter<User>): Promise<User> {
    const user = await this.userModel.findOneAndDelete(userFilterQuery);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
}
