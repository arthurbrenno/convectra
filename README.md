# Convectra

![Convectra](https://img.shields.io/badge/Convectra-API-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Convectra** is a lightweight, Dockerized API providing essential conversion functionalities, including LaTeX to HTML and HTML to Image conversion. Built with Bun, TypeScript, and Zod for validation, Convectra offers a streamlined solution for integrating these conversions into your applications.

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
  - [POST `/api/v1/latex-html`](#post-apiv1latex-html)
  - [POST `/api/v1/html-image`](#post-apiv1html-image)
- [Testing the API](#testing-the-api)
- [License](#license)

## Features

- **LaTeX to HTML Conversion:** Easily convert LaTeX strings to HTML using KaTeX.
- **HTML to Image Conversion:** Convert HTML content to images (PNG, JPEG, WebP).
- **TypeScript & Bun:** Built with TypeScript for type safety and Bun for blazing-fast performance.
- **Validation with Zod:** Robust input validation ensures reliable and secure API interactions.
- **Dockerized:** Simplify deployment with a ready-to-use Docker image.
- **Environment Configuration:** Customize server ports and other settings using environment variables.
- **Optional Conversion Options:** Customize the conversion processes with optional parameters.

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
   git clone https://github.com/yourusername/convectra.git
   cd convectra
   ```

2. **Build the Docker Image**

   Execute the following command in the root directory of the project to build the Docker image:

   ```bash
   docker build -t convectra .
   ```

   - `-t convectra`: Tags the image with the name `convectra`.
   - `.`: Specifies the current directory as the build context.

### Using Docker Compose

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/convectra.git
   cd convectra
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
docker run -d -p 3000:3000 --name convectra convectra
```

- `-d`: Runs the container in detached mode.
- `-p 3000:3000`: Maps port `3000` of the host to port `3000` of the container.
- `--name convectra`: Names the container `convectra`.
- `convectra`: Specifies the Docker image to run.

#### Running with a Custom Port

If you want the server to run on a different port on your host machine, you can map it accordingly and set the `PORT` environment variable.

```bash
docker run -d -p 4000:4000 --name convectra -e PORT=4000 convectra
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

### POST `/api/v1/html-image`

**Description:** Converts an HTML string into an image.

**Request:**

- **Method:** POST
- **URL:** `/api/v1/html-image`
- **Headers:**
  - `Content-Type: application/json`
- **Body:**

  ```json
  {
    "html": "<div style='background-color: red; width: 100px; height: 100px;'>Hello</div>",
    "options": {
      "width": 200,
      "height": 200,
      "backgroundColor": "white",
      "mimeType": "image/png"
    },
    "download": false,
    "filename": "my-image"
  }
  ```

  **Parameters:**

  - `html` (string, required): The HTML string to be converted.
  - `options` (object, optional): Optional parameters to configure the image conversion.
    ```typescript
    interface HtmlToImageOptions {
      width?: number;
      height?: number;
      style?: any; // Allows any CSS style object
      backgroundColor?: string;
      canvasWidth?: number;
      canvasHeight?: number;
      quality?: number; // For JPEG/WebP (0-1)
      pixelRatio?: number;
      foreignObjectRendering?: 'auto' | 'user';
      imagePlaceholder?: string;
      mimeType?: 'image/png' | 'image/jpeg' | 'image/webp';
    }
    ```
  - `download` (boolean, optional): If `true`, the response will trigger a download. Defaults to `false`.
  - `filename` (string, optional): The filename for the download, if `download` is `true`.

**Response:**

- **Status:** `200 OK`
- **Body:** The image data as a binary stream with the `Content-Type` corresponding to the requested `mimeType` (default is `image/png`). If `download` is `true`, the `Content-Disposition` header will be set.

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

- **500 Internal Server Error:** Failed to convert HTML to image.

  ```json
  {
    "error": "Failed to convert HTML to image"
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

#### 2. Testing with Optional Parameters for LaTeX-to-HTML

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

#### 3. Testing `/api/v1/html-image`

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/html-image \
  -H "Content-Type: application/json" \
  -d '{
        "html": "<div style=\"background-color: blue; width: 50px; height: 50px;\"></div>",
        "options": {
          "mimeType": "image/png"
        }
      }'
```

**Expected Response:** A PNG image. Since `curl` is in the terminal, the image data will likely be binary gibberish in your terminal. To save the image, you can redirect the output to a file:

```bash
curl -X POST http://localhost:3000/api/v1/html-image \
  -H "Content-Type: application/json" \
  -d '{
        "html": "<div style=\"background-color: blue; width: 50px; height: 50px;\"></div>",
        "options": {
          "mimeType": "image/png"
        }
      }' > output.png
```

#### 4. Testing `/api/v1/html-image` with Download

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/html-image \
  -H "Content-Type: application/json" \
  -d '{
        "html": "<h1>Downloadable Image</h1>",
        "options": {
          "backgroundColor": "lightgray",
          "mimeType": "image/jpeg",
          "quality": 0.9
        },
        "download": true,
        "filename": "downloadable-image"
      }' -o downloadable-image.jpg
```

**Expected Response:** This command will download an image named `downloadable-image.jpg` containing the rendered HTML. The `-o` flag in `curl` specifies the output filename.

## Building and Running the Docker Container

### Building the Docker Image

Navigate to the root directory of your project and build the Docker image:

```bash
docker build -t convectra .
```

### Running the Docker Container

#### Running with Default Configuration

```bash
docker run -d -p 3000:3000 --name convectra convectra
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
   docker build -t convectra .
   ```

3. **Run the Container with Custom Port**

   ```bash
   docker run -d -p 4000:4000 --name convectra -e PORT=4000 convectra
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

Thank you for choosing **Convectra**! I hope it serves your needs effectively. If you have any questions or need further assistance, please don't hesitate to reach out.
