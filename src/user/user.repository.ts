import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class UserRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }

  // async findAll(usersFilterQuery: QueryFilter<User>): Promise<User[]> {
  //   return this.userModel.find(usersFilterQuery);
  // }

  // async findOne(userFilterQuery: QueryFilter<User>): Promise<User> {
  //   const user = await this.userModel.findOne(userFilterQuery);
  //   if (!user) {
  //     throw new NotFoundException('User not found.');
  //   }
  //   return user;
  // }

  // async create(user: CreateUserDto): Promise<User> {
  //   const newUser = await this.userModel.create(user);
  //   return newUser.save();
  // }

  // async update(
  //   userFilterQuery: QueryFilter<User>,
  //   userUpdate: Partial<User>,
  // ): Promise<User> {
  //   const user = await this.userModel.findOneAndUpdate(
  //     userFilterQuery,
  //     userUpdate,
  //   );
  //   if (!user) {
  //     throw new NotFoundException('User not found.');
  //   }
  //   return user;
  // }

  // async remove(userFilterQuery: QueryFilter<User>): Promise<User> {
  //   const user = await this.userModel.findOneAndDelete(userFilterQuery);
  //   if (!user) {
  //     throw new NotFoundException('User not found.');
  //   }
  //   return user;
  // }
}
