import { userStub } from '../test/stubs/user.stub';

export const UserRepository = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(userStub()),
  find: jest.fn().mockResolvedValue([userStub()]),
  findOne: jest.fn().mockResolvedValue(userStub()),
  findOneAndUpdate: jest.fn().mockResolvedValue(userStub()),
  deleteMany: jest.fn().mockResolvedValue(userStub()),
});
