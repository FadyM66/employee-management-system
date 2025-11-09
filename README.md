# Employee management system APIs

This is a role-based access control (RBAC) system. The project includes a backend that provides APIs for managing employee operations at the frontend.

## Local Development

- To run the Backend, you must have node and npm installed.

- Install the dependencies.

```bash
npm install
```

- Copy `.env.example` file and rename the copy to `.env`.
- Fill the actual values to be set in the `.env` file.
- Run the local server - by default it listen on port 3000 unless another value is provided through the `.env` file or as an environment variable.

```bash
npm run dev
```

## Technologies

### Backend

- [Typescript](https://www.typescriptlang.org/)
- [Expressjs](https://expressjs.com/)
- [tsoa](https://tsoa-community.github.io/docs/) for generating Open API specs
- [drizzle](https://orm.drizzle.team/docs/overview)
- [jiti](https://github.com/unjs/jiti) + [nodemon](https://nodemon.io/) for development
- [eslint](https://eslint.org/) for linting and [prettier](https://prettier.io/) for formatting
