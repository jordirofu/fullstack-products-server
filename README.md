# Product Management API (Backend)

A RESTful API for managing products, built with Node.js and Express.  
This backend provides all CRUD operations required by the frontend application (https://products-maintenance.vercel.app) and is part of a full **PERN stack** project.

The API is fully documented with Swagger, tested with integration tests, and connected to a PostgreSQL database using Sequelize ORM.

## Live API

https://fullstack-products-server.onrender.com

## API Documentation

```
https://fullstack-products-server.onrender.com/docs
```

## Features

- Full **CRUD operations** for products
- RESTful API design
- Request and response validation
- Integration tests with **Jest** and **Supertest**
- Test coverage reporting
- API documentation with **Swagger**
- Database integration with **PostgreSQL**
- ORM-based data management using **Sequelize**

## Tech Stack

- **Node.js** – runtime environment
- **Express** – web framework
- **PostgreSQL** – relational database
- **Sequelize** – ORM for database interaction
- **Jest** – testing framework
- **Supertest** – HTTP assertions for testing
- **Swagger** – API documentation

## Architecture Highlights

### REST API Design

The API follows REST principles, exposing endpoints for:

- Creating products
- Retrieving product lists
- Updating products (full and partial updates)
- Deleting products

### Database Layer

- **Sequelize ORM** is used to interact with PostgreSQL
- Models define the structure and relationships of the data
- Centralized configuration for database connection

### Testing

- Integration tests are implemented using **Jest** and **Supertest** to test API endpoints
- Coverage reports are generated to ensure code quality

### API Documentation

- Swagger is used to provide interactive API documentation
- Developers can explore and test endpoints directly from the browser

## Project Structure

```text
server
 ├── src
 │   ├── __tests__        # Integration tests (Jest + Supertest)
 │   │    ├── product.test.ts
 │   │    └── server.test.ts
 │   ├── config           # Configuration files
 │   │    ├── db.ts
 │   │    └── swagger.ts
 │   ├── data             # Seed or initial data
 │   │    └── index.ts
 │   ├── handlers         # Request handlers (controllers)
 │   │    └── product.ts
 │   ├── middleware       # Custom middleware
 │   │    └── index.ts
 │   ├── models           # Sequelize models
 │   │    └── Product.model.ts
 │   ├── index.ts
 │   ├── router.ts        # API routes
 │   └── server.ts        # App entry point
 │
 ├── coverage             # Test coverage reports
 ├── .env                 # Environment variables
 ├── package.json
 └── tsconfig.json
```

## Installation

Clone the repository:

```bash
git clone https://github.com/jordirofu/product-management-api.git
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Generate coverage report:

```bash
npm run test:coverage
```


## Author

Developed by **Jordi Romero**.