import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from './../src/app.module';
import { DatabaseService } from './../src/database/database.service';
import { e2eUserStub } from './../src/user/test/stubs/user.stub';
import * as request from 'supertest';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

describe('UserController (e2e)', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    await app.init();
    dbConnection = module.get<DatabaseService>(DatabaseService).getDbHandle();
    httpServer = app.getHttpServer();
  });

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should return an array of users', async () => {
      await dbConnection.collection('users').insertOne({ ...e2eUserStub() });
      const response = await request(httpServer).get('/users');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([e2eUserStub()]);
    });
  });

  describe('/users (POST)', () => {
    it('should create a user', async () => {
      const createUserRequest: CreateUserDto = {
        firstname: e2eUserStub().firstname,
        lastname: e2eUserStub().lastname,
        email: e2eUserStub().email,
      };

      const response = await request(httpServer)
        .post('/users')
        .send(createUserRequest);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(e2eUserStub());

      const user = await dbConnection
        .collection('users')
        .findOne({ email: e2eUserStub().email });
      expect(user).toMatchObject(e2eUserStub());
    });
  });

  describe('/users/:id (GET)', () => {
    it('should get a user', async () => {
      const user = await dbConnection
        .collection('users')
        .insertOne(e2eUserStub());

      const response = await request(httpServer).get(
        `/users/${user.insertedId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        ...e2eUserStub(),
        _id: user.insertedId._id.toString(),
      });
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('should update a user', async () => {
      const user = await dbConnection
        .collection('users')
        .insertOne(e2eUserStub());

      const updateUserRequest: UpdateUserDto = {
        firstname: 'Richard',
        lastname: 'Hendricks',
        email: e2eUserStub().email,
      };

      const response = await request(httpServer)
        .patch(`/users/${user.insertedId}`)
        .send(updateUserRequest);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updateUserRequest);

      const updatedUser = await dbConnection
        .collection('users')
        .findOne({ email: e2eUserStub().email });
      expect(updatedUser).toMatchObject(updateUserRequest);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete a user', async () => {
      const user = await dbConnection
        .collection('users')
        .insertOne(e2eUserStub());

      const response = await request(httpServer).delete(
        `/users/${user.insertedId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toBeTruthy();

      const deletedUser = await dbConnection
        .collection('users')
        .findOne({ email: e2eUserStub().email });
      expect(deletedUser).toBeNull();
    });
  });
});
