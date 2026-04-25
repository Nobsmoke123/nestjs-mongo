import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { UserModel } from './test/support/user.model';
import { userStub } from './test/stubs/user.stub';
import { QueryFilter } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userModel: UserModel;
  let userFilterQuery: QueryFilter<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useClass: UserModel,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userModel = module.get<UserModel>(getModelToken(User.name));

    userFilterQuery = {
      _id: userStub()._id,
    };

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(userModel).toBeDefined();
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let user: User;

      beforeEach(async () => {
        jest.spyOn(userModel, 'findOne');
        user = await userRepository.findOne(userFilterQuery, {});
      });

      test('then it should call the userModel', () => {
        expect(userModel.findOne).toHaveBeenCalledWith(userFilterQuery, {});
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('find', () => {
    describe('when find is called', () => {
      let users: User[];

      beforeEach(async () => {
        jest.spyOn(userModel, 'find');
        users = (await userRepository.find(
          userFilterQuery,
        )) as unknown as User[];
      });

      test('then it should call the userModel', () => {
        expect(userModel.find).toHaveBeenCalledWith(userFilterQuery);
      });

      test('then it should return a list of users', () => {
        expect(users).toEqual([userStub()]);
      });
    });
  });

  describe('findOneAndUpdate', () => {
    describe('when findOneAndUpdate is called', () => {
      let user: User;
      let updateUserData: UpdateUserDto;

      beforeEach(async () => {
        jest.spyOn(userModel, 'findOneAndUpdate');

        updateUserData = {
          firstname: userStub().firstname,
          lastname: userStub().lastname,
        };

        user = await userRepository.findOneAndUpdate(
          userFilterQuery,
          updateUserData,
        );
      });

      test('then it should call the userModel', () => {
        expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
          userFilterQuery,
          updateUserData,
          { returnDocument: 'after' },
        );
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('create', () => {
    describe('when create is called', () => {
      let user: User;
      let createUserData: CreateUserDto;

      beforeEach(async () => {
        jest.spyOn(userModel, 'create');

        createUserData = {
          firstname: userStub().firstname,
          lastname: userStub().lastname,
          email: userStub().email,
        };

        user = await userRepository.create(createUserData);
      });

      test('then it should call the userModel', () => {
        expect(userModel.create).toHaveBeenCalledWith(createUserData);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('deleteMany', () => {
    describe('when deleteMany is called', () => {
      let result: boolean;

      beforeEach(async () => {
        jest.spyOn(userModel, 'deleteMany');
        result = await userRepository.deleteMany(userFilterQuery);
      });

      test('then it should call the userModel', () => {
        expect(userModel.deleteMany).toHaveBeenCalledWith(userFilterQuery);
      });

      test('then it should return a user', () => {
        expect(result).toBeTruthy();
      });
    });
  });
});
