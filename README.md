# MOCK SHOP

Puzzle home-challenge...

## Requirements

- MongoDB Atlas alternatively a local mongodb instance with a replica set configured. If you use MongoDB Atlas, a replica set
  will be configured automatically for you.

## Information

- All db related scripts are configured to run "prevdev". So you don't have to execute them individually.
- MongoDB user needs to have admin rights configured. Hence in case you use MongoDB Atlas, you'll need to set admin permissions
  for your user via the UI as this is not set by default for new users via Atlas. If sufficient permissions are not set the reset db script won't be able to successfully run.
- JWT auth and hashing of passwords with bcrypt has been implemented.
- API will run on port 5001 by default, and the React app runs on port 5173 (unless configured differently).
- A default user is seeded with the following credentials that you can use to login.

IMPORTANT: If yarn dev fails the first time you run the repo after cloning the repo, just run yarn dev again and it should work.

```
 email: admin@example.com
 password: password
```

## Run this app locally

1. In the "apps/api" directory and "apps/frontend", create a ".env" file.
2. Copy the variables from ".env.example".
3. Update the values in the ".env" file as needed.
4. Save the changes.

Run the following commands in the root of the project:

```
yarn install
yarn dev
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `api`: an [Express](https://expressjs.com/) server
- `frontend`: a [Preact.js](https://preactjs.com/) app
- `scripts`: Jest and ESLint configurations
- `tsconfig`: tsconfig.json;s used throughout the monorepo

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
