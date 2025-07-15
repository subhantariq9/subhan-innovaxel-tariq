# subhan-innovaxel-tariq

Assessment task for the role of ASE at innovaxel.

# URL Shortening Service

This project implements a simple RESTful API for a URL shortening service, allowing users to create, retrieve, update, and delete short URLs, and to view access statistics. It is built using Node.js, Express.js, and PostgreSQL with Sequelize as the ORM.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)

## Project Overview

This service provides the core functionality of a URL shortener:
- Generates unique short codes for long URLs.
- Redirects users from a short URL to the original long URL.
- Tracks the number of times a short URL has been accessed.
- Offers a set of RESTful API endpoints for managing short URLs.

## Technologies Used

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **ORM:** Sequelize
* **Unique ID Generation:** Nano ID
* **Environment Variables:** Dotenv
* **Development Server:** Nodemon

## Prerequisites

Before running this project, ensure you have the following installed:

* **Node.js:** (LTS version recommended)
* **npm:** (Comes with Node.js)
* **PostgreSQL:** Database server
* **Git:** For version control

## Setup Instructions

Follow these steps to get the project up and running on your local machine:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/subhan-innovaxel-tariq/subhan-innovaxel-tariq.git](https://github.com/subhan-innovaxel-tariq/subhan-innovaxel-tariq.git) # Replace with your actual repo URL if different
    cd subhan-innovaxel-tariq
    ```

2.  **Switch to the `dev` branch:**
    The main application code resides on the `dev` branch.
    ```bash
    git checkout dev
    ```

3.  **Install Dependencies:**
    Navigate to the project root and install the required Node.js packages:
    ```bash
    npm install
    ```

4.  **Database Setup (PostgreSQL):**
    * Ensure your PostgreSQL server is running.
    * Create a new database for the project (e.g., `url_shortener`). You can use `psql` or `pgAdmin`.
        ```sql
        CREATE DATABASE url_shortener;
        ```
    * Create a `.env` file in the project root and configure your database connection details. Replace placeholders with your actual PostgreSQL credentials:
        ```
        PORT=5000
        DB_HOST=localhost
        DB_PORT=5432
        DB_NAME=url_shortener
        DB_USER=your_pg_username
        DB_PASSWORD=your_pg_password
        ```

5.  **Run the Application:**
    Once the dependencies are installed and the `.env` file is configured, you can start the server:
    ```bash
    npm run dev
    ```
    The server should start on the port specified in your `.env` file (default: `5000`). You will see "PostgreSQL Connection has been established successfully." and "Database synchronized" in your console.

## API Endpoints

The API is accessible via `http://localhost:5000/api/shorten`. All requests (except direct short URL access) should have `Content-Type: application/json` in their headers for `POST` and `PUT` requests.

### 1. Create Short URL

* **Endpoint:** `POST /api/shorten`
* **Description:** Creates a new short URL for a given long URL.
* **Request Body (JSON):**
    ```json
    {
        "url": "[https://www.example.com/some/very/long/url](https://www.example.com/some/very/long/url)"
    }
    ```
* **Success Response (201 Created):**
    ```json
    {
        "id": 1,
        "url": "[https://www.example.com/some/very/long/url](https://www.example.com/some/very/long/url)",
        "shortCode": "abcXYZ",
        "createdAt": "2025-07-16T12:00:00.000Z",
        "updatedAt": "2025-07-16T12:00:00.000Z"
    }
    ```
* **Error Responses:** `400 Bad Request` (invalid URL/missing URL), `409 Conflict` (generated short code already exists).

### 2. Retrieve Original URL and Statistics

* **Endpoint:** `GET /api/shorten/:shortCode`
* **Description:** Retrieves the original long URL and access statistics for a given short code. This is for API clients.
* **Success Response (200 OK):**
    ```json
    {
        "id": 1,
        "url": "[https://www.example.com/some/very/long/url](https://www.example.com/some/very/long/url)",
        "shortCode": "abcXYZ",
        "createdAt": "2025-07-16T12:00:00.000Z",
        "updatedAt": "2025-07-16T12:00:00.000Z",
        "accessCount": 5
    }
    ```
* **Error Responses:** `404 Not Found` (short URL not found).

### 3. Update Short URL

* **Endpoint:** `PUT /api/shorten/:shortCode`
* **Description:** Updates the original URL associated with an existing short code.
* **Request Body (JSON):**
    ```json
    {
        "url": "[https://www.example.com/some/updated/url](https://www.example.com/some/updated/url)"
    }
    ```
* **Success Response (200 OK):**
    ```json
    {
        "id": 1,
        "url": "[https://www.example.com/some/updated/url](https://www.example.com/some/updated/url)",
        "shortCode": "abcXYZ",
        "createdAt": "2025-07-16T12:00:00.000Z",
        "updatedAt": "2025-07-16T12:30:00.000Z"
    }
    ```
* **Error Responses:** `400 Bad Request` (invalid URL/missing URL), `404 Not Found` (short URL not found).

### 4. Delete Short URL

* **Endpoint:** `DELETE /api/shorten/:shortCode`
* **Description:** Deletes an existing short URL entry.
* **Success Response (204 No Content):** (Empty body)
* **Error Responses:** `404 Not Found` (short URL not found).

### 5. Short URL Redirection (Browser Access)

* **Endpoint:** `GET /:shortCode`
* **Description:** When a short URL (e.g., `http://localhost:5000/abcXYZ`) is accessed directly in a web browser, the server will redirect the browser to the original long URL. This action also increments the `accessCount` for that short URL.
* **Behavior:** Performs a `301 Moved Permanently` redirect.

## Database Schema

The `urls` table in PostgreSQL has the following structure (managed by Sequelize):

* `id`: INTEGER, Primary Key, Auto-increment
* `url`: STRING, Not Null (The original long URL)
* `shortCode`: STRING, Not Null, Unique (The generated short code)
* `accessCount`: INTEGER, Default: 0 (Number of times the short URL has been accessed)
* `createdAt`: DATETIME (Timestamp of creation)
* `updatedAt`: DATETIME (Timestamp of last update)