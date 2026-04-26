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
  main.ts
  user/
    dto/
      create-user.dto.ts
      update-user.dto.ts
    schemas/
      user.schema.ts
    user.controller.ts
    user.module.ts
    user.repository.ts
    user.service.ts
test/
  app.e2e-spec.ts
```

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

## API Reference

### Health/Default

#### `GET /`

Returns:

```json
"Hello World!"
```

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
