import { User } from '../../schemas/user.schema';

export const userStub = (): User & { _id: string } => ({
  _id: '69ec05a9f01747ab4fa67a94',
  firstname: 'Donald',
  lastname: 'Miguel',
  email: 'donaldakobundu@gmail.com',
});

export const e2eUserStub = (): User => ({
  firstname: 'Donald',
  lastname: 'Miguel',
  email: 'donaldakobundu@gmail.com',
});