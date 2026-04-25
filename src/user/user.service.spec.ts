import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { userStub } from './test/stubs/user.stub';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('./user.repository.ts');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
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

        user = await userService.create(createUserDto);
      });

      test('then it should call user repository', () => {
        expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      });

      test('then should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let users: User[];

      beforeEach(async () => {
        users = (await userService.findAll()) as unknown as User[];
      });

      test('then it should call user repository', () => {
        expect(userRepository.find).toHaveBeenCalledWith({});
      });

      test('then should return a list of users', () => {
        expect(users).toEqual([userStub()]);
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await userService.findOne(userStub()._id);
      });

      test('then it should call user repository', () => {
        expect(userRepository.findOne).toHaveBeenCalledWith(
          {
            _id: userStub()._id,
          },
          {},
        );
      });

      test('then should return a user', () => {
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
        };

        user = await userService.update(userStub()._id, updateUserDto);
      });

      test('then it should call user repository', () => {
        expect(userRepository.findOneAndUpdate).toHaveBeenCalledWith(
          {
            _id: userStub()._id,
          },
          updateUserDto,
        );
      });

      test('then should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      let result: boolean;

      beforeEach(async () => {
        result = await userService.remove(userStub()._id);
      });

      test('then it should call user repository', () => {
        expect(userRepository.deleteMany).toHaveBeenCalledWith({
          _id: userStub()._id,
        });
      });

      test('then should return a user', () => {
        expect(result).toBeTruthy();
      });
    });
  });
});
