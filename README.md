# ⚙️ LikDai (Backend)

The **LikDai Backend** powers the core functionality of the LikDai typing tutor app — handling user authentication, typing statistics, leaderboard data, and more.

This service is built with **Node.js** and **Express.js**, offering a robust and scalable API for the LikDai frontend.

---

## 🧩 Features

-   🔐 **JWT-based Authentication**: Secure user login, registration, and session management with access and refresh tokens.
-   📝 **Typing Data Recording**: Endpoints to save user typing session results, including WPM and accuracy.
-   📈 **User Statistics & Leaderboard**: Logic to calculate and retrieve user performance and rank users on a leaderboard.
-   🌐 **RESTful API Endpoints**: A clear and well-structured API for the frontend application to consume.
-   🗄️ **PostgreSQL Integration**: Uses a powerful relational database for persistent data storage.
-   ⚙️ **Environment-based Configuration**: Easy setup and configuration using environment variables.
-   🔒 **Secure Password Hashing**: Utilizes `bcrypt` for strong password encryption.

---

## 🛠️ Tech Stack

-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [JSON Web Token (JWT)](https://jwt.io/)
-   **Security**: [CORS](https://expressjs.com/en/resources/middleware/cors.html), [Helmet](https://helmetjs.github.io/), [bcrypt](https://www.npmjs.com/package/bcrypt)
-   **Environment Variables**: [Dotenv](https://www.npmjs.com/package/dotenv)

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the backend server up and running for development.

### Prerequisites

You need to have the following software installed on your machine:
-   [Node.js](https://nodejs.org/) (v18 or later is recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [PostgreSQL](https://www.postgresql.org/download/)

### Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone [https://github.com/your-username/likdai-backend.git](https://github.com/your-username/likdai-backend.git)
    cd likdai-backend
    ```

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Set Up the Database**
    -   Make sure your PostgreSQL instance is running.
    -   Create a new database for this project (e.g., `likdai`).
    -   Or use can use Neon Database - `https://neon.com`

4.  **Configure Environment Variables**
    -   Create a `.env` file in the root of the project by copying the example file:
    ```sh
    cp .env.example .env
    ```
    -   Open the new `.env` file and fill in the required values, especially your `DATABASE_URL` and JWT secrets.
    ```env
    # .env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    FRONTEND_URL="http://localhost:3001"
    PORT="8001"
    NODE_ENV="development"
    JWT_ACCESS_SECRET="your_strong_access_secret"
    JWT_REFRESH_SECRET="your_strong_refresh_secret"
    JWT_RESET_SECRET="your_strong_reset_secret"
    MAIL_USER="your_email@gmail.com"
    MAIL_PASS="your_app_specific_password"
    DEVELOPER_EMAIL="your_developer_email@gmail.com"
    ```

5.  **Run Database Migrations**
    -   This command uses Prisma to create the necessary tables in your database.
    ```sh
    npx prisma migrate dev
    ```

6.  **Start the Server**
    -   This command runs the server in development mode with auto-reloading.
    ```sh
    npm run dev
    ```
    The server should now be running on the port you specified (e.g., `http://localhost:8001`).

---

## 🤝 Contributing

This project is fully open source. We welcome contributions of any kind — whether it’s fixing bugs, improving documentation, adding new features, or sharing ideas.

Feel free to open an issue or submit a pull request!

Thank you for being part of this open-source journey! 🚀
