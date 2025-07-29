# WorkCity Project Management - Backend API

This is the complete RESTful API for the WorkCity Project Management application, built with Node.js, Express, and MongoDB. It handles user authentication, data storage, and business logic for clients and projects.

## Features

- **JWT-Based Authentication**: Secure signup and login functionality using JSON Web Tokens.
- **User Roles**: Differentiated access levels between `admin` and `user` roles.
- **CRUD for Clients**: Full Create, Read, Update, and Delete operations for client management.
- **CRUD for Projects**: Full Create, Read, Update, and Delete operations for project management.
- **Client-Project Linking**: Ability to associate projects with specific clients and fetch all projects for a given client.
- **Input Validation**: Server-side validation to ensure data integrity.
- **Unit Tests**: Includes unit tests for key endpoints to ensure reliability.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **JSON Web Token (JWT)**: For handling secure authentication.
- **bcryptjs**: For password hashing.
- **express-validator**: For input validation.
- **Jest & Supertest**: For unit testing the API endpoints.

---

## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a connection string from a cloud provider like MongoDB Atlas.

### Steps

1.  **Clone the repository** (or set up the files in a `backend` directory).

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Create an environment file**:
    Create a `.env` file in the root of the backend directory and add the following variables. Fill them in with your own credentials.

    ```env
    PORT=5001
    MONGO_URI=mongodb://localhost:27017/workcityDB
    JWT_SECRET=your_super_secret_jwt_key_that_is_long_and_random
    JWT_EXPIRES_IN=1d
    ```

4.  **Run the server**:

    - For development (with automatic restarts):
      ```bash
      npm run dev
      ```
    - For production:
      `bash npm start`
      The API will be running at `http://localhost:5001`.

5.  **Run tests**:
    To ensure all endpoints are working correctly, run the unit tests:
    ```bash
    npm test
    ```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint  | Description          | Access |
| :----- | :-------- | :------------------- | :----- |
| `POST` | `/signup` | Register a new user. | Public |
| `POST` | `/login`  | Authenticate a user. | Public |

### Clients (`/api/clients`)

| Method   | Endpoint | Description                | Access       |
| :------- | :------- | :------------------------- | :----------- |
| `GET`    | `/`      | Get all clients.           | User / Admin |
| `POST`   | `/`      | Create a new client.       | User / Admin |
| `GET`    | `/:id`   | Get a single client by ID. | User / Admin |
| `PUT`    | `/:id`   | Update a client by ID.     | Admin Only   |
| `DELETE` | `/:id`   | Delete a client by ID.     | Admin Only   |

### Projects (`/api/projects`)

| Method   | Endpoint            | Description                             | Access       |
| :------- | :------------------ | :-------------------------------------- | :----------- |
| `GET`    | `/`                 | Get all projects.                       | User / Admin |
| `POST`   | `/`                 | Create a new project.                   | User / Admin |
| `GET`    | `/client/:clientId` | Get all projects for a specific client. | User / Admin |
| `GET`    | `/:id`              | Get a single project by ID.             | User / Admin |
| `PUT`    | `/:id`              | Update a project by ID.                 | Admin Only   |
| `DELETE` | `/:id`              | Delete a project by ID.                 | Admin Only   |
