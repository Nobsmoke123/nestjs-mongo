import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { userStub } from './test/stubs/user.stub';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('./user.service.ts');

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    describe('When findOne is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await userController.findOne(userStub()._id);
      });

      test('then it should call userService', () => {
        expect(userService.findOne).toHaveBeenCalledWith(userStub()._id);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('findAll', () => {
    describe('When findAll is called', () => {
      let users: User[];

      beforeEach(async () => {
        users = (await userController.findAll()) as unknown as User[];
      });

      test('then it should call userService', () => {
        expect(userService.findAll).toHaveBeenCalled();
      });

      test('then it should return a list of users', () => {
        expect(users).toEqual([userStub()]);
      });
    });
  });

  describe('create', () => {
    describe('when create is called', () => {
      let user: User;
      let createUserDto: CreateUserDto;

      beforeEach(async () => {
        createUserDto = {
          firstname: userStub().firstname,
          lastname: userStub().lastname,
          email: userStub().email,
        };

        user = await userController.create(createUserDto);
      });

      test('then it should call userService', () => {
        expect(userService.create).toHaveBeenCalledWith(createUserDto);
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let user: User;
      let updateUserDto: UpdateUserDto;

      beforeEach(async () => {
        updateUserDto = {
          firstname: userStub().firstname,
          lastname: userStub().lastname,
          email: userStub().email,
        };

        user = await userController.update(userStub()._id, updateUserDto);
      });

      test('then it should call userService', () => {
        expect(userService.update).toHaveBeenCalledWith(
          userStub()._id,
          updateUserDto,
        );
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      let result: boolean;

      beforeEach(async () => {
        result = await userController.remove(userStub()._id);
      });

      test('then it should call userService', () => {
        expect(userService.remove).toHaveBeenCalledWith(userStub()._id);
      });

      test('then it should return a boolean', () => {
        expect(result).toBeTruthy();
      });
    });
  });
});
