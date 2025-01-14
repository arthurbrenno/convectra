# LaTeX-to-HTML API

![LaTeX-to-HTML API](https://img.shields.io/badge/LaTeX--to--HTML-API-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**LaTeX-to-HTML API** is a lightweight, Dockerized API designed to seamlessly convert LaTeX expressions into HTML using Bun, TypeScript, Zod for validation, and KaTeX for rendering. Whether you're integrating mathematical expressions into your web applications or automating document processing, LaTeX-to-HTML API provides a robust and scalable solution.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Using Docker](#using-docker)
  - [Using Docker Compose](#using-docker-compose)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
  - [Using Docker](#using-docker-1)
  - [Using Docker Compose](#using-docker-compose-1)
- [API Documentation](#api-documentation)
  - [POST `/render`](#post-render)
- [Testing the API](#testing-the-api)
- [License](#license)

## Features

- **LaTeX to HTML Conversion:** Easily convert LaTeX strings to HTML using KaTeX.
- **TypeScript & Bun:** Built with TypeScript for type safety and Bun for blazing-fast performance.
- **Validation with Zod:** Robust input validation ensures reliable and secure API interactions.
- **Dockerized:** Simplify deployment with a ready-to-use Docker image.
- **API Versioning:** Organized routing with a versioned API prefix (`/api/v1`), facilitating future expansions.
- **Environment Configuration:** Customize server ports and other settings using environment variables.
- **Optional Rendering Options:** Customize the rendering process with optional parameters.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Docker:** Installed on your machine. You can download Docker from [here](https://www.docker.com/get-started).
- **Docker Compose:** Installed on your machine. It usually comes bundled with Docker Desktop. Verify installation with:

  ```bash
  docker-compose --version
  ```
  
- **Bun:** Although Docker handles the runtime, having Bun installed locally can be beneficial for development. Install Bun by following the instructions on the [official website](https://bun.sh/).

## Installation

### Using Docker

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/latex-to-html.git
   cd latex-to-html
   ```

2. **Build the Docker Image**

   Execute the following command in the root directory of the project to build the Docker image:

   ```bash
   docker build -t latex-to-html .
   ```

   - `-t latex-to-html`: Tags the image with the name `latex-to-html`.
   - `.`: Specifies the current directory as the build context.

### Using Docker Compose

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/latex-to-html.git
   cd latex-to-html
   ```

2. **Build and Run with Docker Compose**

   Execute the following command to build the image and start the container:

   ```bash
   docker-compose up -d
   ```

   - `up`: Builds, (re)creates, starts, and attaches to containers for a service.
   - `-d`: Runs the containers in detached mode (in the background).

## Configuration

Configure the server by setting environment variables. You can define these variables in a `.env` file located in the root directory of the project.

1. **Create a `.env` File**

   ```bash
   touch .env
   ```

2. **Add the Following Variables to `.env`**

   ```env
   PORT=3000
   API_PREFIX=/api/v1
   ```

   - **PORT:** The port on which the server will listen. Default is `3000`.
   - **API_PREFIX:** The prefix for all API routes. Default is `/api/v1`.

**Note:** Docker automatically loads variables from the `.env` file when using Docker Compose. When running Docker directly, ensure to pass the `.env` variables or set them accordingly.

## Running the Server

After building the Docker image and configuring the environment variables, you can run the server using Docker or Docker Compose.

### Using Docker

#### Running with Default Port

```bash
docker run -d -p 3000:3000 --name latex-to-html latex-to-html
```

- `-d`: Runs the container in detached mode.
- `-p 3000:3000`: Maps port `3000` of the host to port `3000` of the container.
- `--name latex-to-html`: Names the container `latex-to-html`.
- `latex-to-html`: Specifies the Docker image to run.

#### Running with a Custom Port

If you want the server to run on a different port on your host machine, you can map it accordingly and set the `PORT` environment variable.

```bash
docker run -d -p 4000:4000 --name latex-to-html -e PORT=4000 latex-to-html
```

- `-p 4000:4000`: Maps port `4000` of the host to port `4000` of the container.
- `-e PORT=4000`: Sets the `PORT` environment variable inside the container to `4000`.

**Important:**

- **Port Consistency:** If you change the application port via the `PORT` environment variable, ensure you map the host port to the corresponding container port.

### Using Docker Compose

#### Running with Default Configuration

```bash
docker-compose up -d
```

- **Builds** the Docker image (if not already built).
- **Starts** the container in detached mode.

#### Running with Custom Port

1. **Update `.env` File**

   ```env
   PORT=4000
   API_PREFIX=/api/v1
   ```

2. **Build and Run with Docker Compose**

   ```bash
   docker-compose up -d --build
   ```

   - `--build`: Rebuilds the images before starting containers.

**Explanation:**

- The `docker-compose.yml` uses environment variables from the `.env` file to configure the port and API prefix.
- By default, the server listens on port `3000`, but you can change it by modifying the `.env` file.

## API Documentation

### POST `/api/v1/latex-html`

**Description:** Converts a LaTeX string into rendered HTML using KaTeX.

**Request:**

- **Method:** POST
- **URL:** `/api/v1/latex-html`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**

  ```json
  {
    "latex": "c = \\pm\\sqrt{a^2 + b^2}",
    "options": {
      "displayMode": true,
      "output": "htmlAndMathml",
      "leqno": false,
      "fleqn": false,
      "throwOnError": true,
      "errorColor": "#cc0000",
      "macros": {},
      "minRuleThickness": 0.05,
      "colorIsTextColor": false,
      "maxSize": Infinity,
      "maxExpand": 1000,
      "strict": "warn",
      "trust": false,
      "globalGroup": false
    }
  }
  ```

  **Parameters:**

  - `latex` (string, required): The LaTeX string to be converted.
  - `options` (object, optional): Optional parameters to customize the rendering process.

    ```typescript
    /**
     * Options for `katex.render` and `katex.renderToString`.
     * @see https://katex.org/docs/options
     */
    export interface KatexOptions {
        displayMode?: boolean;
        output?: "html" | "mathml" | "htmlAndMathml";
        leqno?: boolean;
        fleqn?: boolean;
        throwOnError?: boolean;
        errorColor?: string;
        macros?: Record<string, string | object | ((macroExpander:object) => string | object)>;
        minRuleThickness?: number;
        colorIsTextColor?: boolean;
        maxSize?: number;
        maxExpand?: number;
        strict?:
            | boolean
            | "ignore" | "warn" | "error"
            | StrictFunction;
        trust?: boolean | ((context: TrustContext) => boolean);
        globalGroup?: boolean;
    }
    ```

**Response:**

- **Status:** `200 OK`
- **Body:**

  ```json
  {
    "html": "<span class=\"katex\">c = \\pm\\sqrt{a^2 + b^2}</span>"
  }
  ```

**Error Responses:**

- **400 Bad Request:** Invalid JSON or input fails validation.

  ```json
  {
    "error": "Invalid JSON"
  }
  ```

  ```json
  {
    "error": "Invalid input",
    "details": [/* validation error details */]
  }
  ```

- **500 Internal Server Error:** Failed to render LaTeX.

  ```json
  {
    "error": "Failed to render LaTeX"
  }
  ```

## Testing the API

You can test the API endpoint using tools like `curl`, [Postman](https://www.postman.com/), or [Insomnia](https://insomnia.rest/).

### Example with `curl`

#### 1. Testing `/api/v1/latex-html`

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/latex-html \
  -H "Content-Type: application/json" \
  -d '{
        "latex": "c = \\pm\\sqrt{a^2 + b^2}",
        "options": {
          "displayMode": true,
          "output": "htmlAndMathml"
        }
      }'
```

**Expected Response:**

```json
{
  "html": "<span class=\"katex\">c = \\pm\\sqrt{a^2 + b^2}</span>"
}
```

**Note:** The exact content of the `html` field depends on the KaTeX rendering.

#### 2. Testing with Optional Parameters

You can customize the rendering by providing optional parameters.

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/latex-html \
  -H "Content-Type: application/json" \
  -d '{
        "latex": "\\frac{a}{b}",
        "options": {
          "displayMode": false,
          "output": "html",
          "throwOnError": false
        }
      }'
```

**Expected Response:**

```json
{
  "html": "<span class=\"katex\">\\frac{a}{b}</span>"
}
```

## Building and Running the Docker Container

### Building the Docker Image

Navigate to the root directory of your project and build the Docker image:

```bash
docker build -t latex-to-html .
```

### Running the Docker Container

#### Running with Default Configuration

```bash
docker run -d -p 3000:3000 --name latex-to-html latex-to-html
```

#### Running with Custom Port

To run the server on port `4000` on your host machine:

1. **Update `.env` File**

   ```env
   PORT=4000
   API_PREFIX=/api/v1
   ```

2. **Rebuild the Docker Image**

   ```bash
   docker build -t latex-to-html .
   ```

3. **Run the Container with Custom Port**

   ```bash
   docker run -d -p 4000:4000 --name latex-to-html -e PORT=4000 latex-to-html
   ```

**Explanation:**

- `-p <host_port>:<container_port>`: Maps the specified host port to the container port.
- `-e PORT=<container_port>`: Sets the `PORT` environment variable inside the container.

### Using Docker Compose

Docker Compose simplifies the process of building and running your Docker containers. It handles the build and run steps with a single command.

#### Running with Docker Compose

```bash
docker-compose up -d
```

#### Running with Docker Compose and Custom Port

1. **Update `.env` File**

   ```env
   PORT=4000
   API_PREFIX=/api/v1
   ```

2. **Build and Run with Docker Compose**

   ```bash
   docker-compose up -d --build
   ```

   - `--build`: Rebuilds the images before starting containers.

## License

This project is licensed under the [MIT License](LICENSE).

---

Thank you for choosing **LaTeX-to-HTML API**! I hope it serves your needs effectively. If you have any questions or need further assistance, please don't hesitate to reach out.
