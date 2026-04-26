# NestJS + MongoDB Users API

A REST API built with NestJS and Mongoose for basic user CRUD operations.

This project is a clean starter for:

- Structuring a NestJS app with modules, services, controllers, and repositories
- Connecting to MongoDB with `@nestjs/mongoose`
- Validating incoming payloads with `class-validator` and a global `ValidationPipe`
- Writing unit and e2e tests with Jest

## Tech Stack

- **Framework:** NestJS 11
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Validation:** `class-validator` + `class-transformer`
- **Package manager:** pnpm
- **Testing:** Jest + Supertest

## Project Structure

```text
src/
  app.module.ts
  database/
    database.module.ts
    database.service.ts
  user/
    user.controller.ts
    user.service.ts
    user.repository.ts
    user.service.spec.ts
    user.controller.spec.ts
    user.repository.spec.ts
    test/
      stubs/user.stub.ts
      support/user.model.ts
test/
  jest-e2e.json
  user.e2e-spec.ts
```

## Prerequisites

- Node.js 20+ (or compatible with NestJS 11)
- pnpm
- MongoDB instance(s)

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/nestjs-mongo
MONGODB_URI_TEST=mongodb://localhost:27017/nestjs-mongo-test
NODE_ENV=development
```

`src/app.module.ts` switches DB connection by environment:
- `NODE_ENV=test` -> uses `MONGODB_URI_TEST`
- otherwise -> uses `MONGODB_URI`

## How It Works

- `AppModule` loads config and creates a Mongo connection using `MONGODB_URI`.
- `UserModule` registers the `User` schema and exposes user endpoints.
- `UserController` defines HTTP routes.
- `UserService` holds business flow and delegates to repository methods.
- `UserRepository` encapsulates database operations and throws `NotFoundException` when needed.

## Environment Variables

Create a local `.env` file (or copy from `.env.sample`) with:

```env
MONGODB_URI=mongodb://localhost:27017/nestjs-mongo
PORT=3000
```

Notes:

- `MONGODB_URI` is required.
- `PORT` is optional; defaults to `3000`.

## Getting Started

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment

```bash
cp .env.sample .env
```

Then update `.env` with your MongoDB connection string.

### 3) Run the API

```bash
# Standard
pnpm run start

# Development (watch mode)
pnpm run start:dev

# Debug watch mode
pnpm run start:debug

# Production build + run
pnpm run build
pnpm run start:prod
```

Base URL (local): `http://localhost:3000`

## Validation Behavior

A global `ValidationPipe` is enabled in `main.ts` with:

- `forbidUnknownValues: true`
- `forbidNonWhitelisted: true`

DTO validation currently enforces string fields for create/update payloads.

## API Overview

Current e2e coverage targets the `users` resource:

- `GET /users`
- `POST /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`

## Testing Guide

This project has two test layers:

- **Unit tests** in `src/**/**.spec.ts`
- **E2E tests** in `test/**/*.e2e-spec.ts`

---

## Unit Tests (Jest)

Run:

```bash
pnpm run test
```

Watch mode:

```bash
pnpm run test:watch
```

Coverage report:

```bash
pnpm run test:cov
```

### Unit Test Scope

#### 1) Controller tests: `src/user/user.controller.spec.ts`

Validates controller behavior in isolation by mocking `UserService`:

- Confirms each controller method calls the expected service method.
- Verifies returned payloads for:
  - `findOne`
  - `findAll`
  - `create`
  - `update`
  - `remove`

#### 2) Service tests: `src/user/user.service.spec.ts`

Validates service logic in isolation by mocking `UserRepository`:

- Ensures repository methods are called with correct filters and DTOs.
- Verifies service method return values for:
  - `create`
  - `findAll`
  - `findOne`
  - `update`
  - `remove`

#### 3) Repository tests: `src/user/user.repository.spec.ts`

Validates repository behavior against a mocked Mongoose model:

- Asserts model interaction for:
  - `findOne`
  - `find`
  - `findOneAndUpdate` (including `{ returnDocument: 'after' }`)
  - `create`
  - `deleteMany`
- Confirms returned values from each repository operation.

### Unit Test Data and Mocks

- Shared test fixtures are in `src/user/test/stubs/user.stub.ts`.
- `userStub()` includes an `_id` for unit tests.
- Test-specific model mocks are in `src/user/test/support/user.model.ts`.

---

## End-to-End Tests (Jest + Supertest)

Run:

```bash
NODE_ENV=test pnpm run test:e2e
```

Debug mode (for breakpoints):

```bash
NODE_ENV=test pnpm run test:debug -- test/user.e2e-spec.ts
```

### E2E Test Scope

File: `test/user.e2e-spec.ts`

The suite bootstraps a real Nest application (`AppModule`) and tests the full request pipeline:

- HTTP routing
- controller + service + repository wiring
- MongoDB persistence
- response codes and payloads

### E2E Setup Details

- `beforeAll`: creates a Nest app and obtains a raw Mongo `Connection` via `DatabaseService`.
- `beforeEach`: clears the `users` collection to keep tests isolated.
- `afterAll`: clears data and closes the app.

This gives deterministic CRUD tests while still exercising real database behavior.

### E2E Scenarios Covered

1. **GET `/users`**
   - seeds DB with one user
   - expects `200` and an array containing that user

2. **POST `/users`**
   - sends `CreateUserDto`
   - expects `201`
   - confirms response body and persisted DB document

3. **GET `/users/:id`**
   - inserts a user directly via Mongo
   - fetches by inserted id
   - expects `200` and correct payload

4. **PATCH `/users/:id`**
   - updates an existing user with `UpdateUserDto`
   - expects `200`
   - verifies both response and stored document reflect update

5. **DELETE `/users/:id`**
   - deletes an existing user
   - expects `200`
   - confirms document no longer exists

### E2E Test Data

- `e2eUserStub()` in `src/user/test/stubs/user.stub.ts` provides a stable user object without `_id`.

## Useful Commands

```bash
# lint
pnpm run lint

# run all unit tests once
pnpm run test

# run e2e tests
NODE_ENV=test pnpm run test:e2e

# generate coverage
pnpm run test:cov
```

## Notes

- If e2e tests fail on DB connection, verify `MONGODB_URI_TEST` and that MongoDB is running.
- Keep the test database separate from development data.
- Unit tests are fast and isolated; e2e tests are slower but validate integration and persistence.


## API Reference

### Users

#### `POST /users`

Create a user.

Request body:

```json
{
  "firstname": "Ada",
  "lastname": "Lovelace",
  "email": "ada@example.com"
}
```

Response: created user document.

#### `GET /users`

Get all users.

Response: array of user documents.

#### `GET /users/:id`

Get a single user by `id` (custom user field, not Mongo `_id`).

Response: user document or `404`.

#### `PATCH /users/:id`

Partially update a user by `id`.

Request body (any subset of user fields):

```json
{
  "firstname": "Grace"
}
```

Response: updated user document.

#### `DELETE /users/:id`

Delete a user by `id`.

Response: deleted user document.

## Quick cURL Examples

```bash
# Create
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"firstname":"Ada","lastname":"Lovelace","email":"ada@example.com"}'

# List
curl http://localhost:3000/users

# Get one by id
curl http://localhost:3000/users/<user-id>

# Update
curl -X PATCH http://localhost:3000/users/<user-id> \
  -H "Content-Type: application/json" \
  -d '{"lastname":"Byron"}'

# Delete
curl -X DELETE http://localhost:3000/users/<user-id>
```

## Available Scripts

```bash
pnpm run build       # Build TypeScript -> dist/
pnpm run format      # Prettier format for src/test
pnpm run lint        # ESLint with --fix
pnpm run start       # Run app
pnpm run start:dev   # Run app in watch mode
pnpm run start:debug # Run app with debugger + watch
pnpm run start:prod  # Run built app from dist/
pnpm run test        # Unit tests
pnpm run test:watch  # Unit tests in watch mode
pnpm run test:cov    # Coverage report
pnpm run test:e2e    # End-to-end tests
```

## Testing

Run unit tests:

```bash
pnpm run test
```

Run e2e tests:

```bash
pnpm run test:e2e
```

Run coverage:

```bash
pnpm run test:cov
```

## Error Handling

Repository methods throw `NotFoundException('User not found.')` when no matching user exists for:

- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`

## Common Pitfalls

- The API queries users by `id` field, not MongoDB `_id`.
- If you create users without an `id`, lookups by route `:id` will fail.
- Ensure your MongoDB instance is reachable from the value in `MONGODB_URI`.

## License

This project is marked as `UNLICENSED` in `package.json`.