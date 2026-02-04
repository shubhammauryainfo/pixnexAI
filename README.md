# PixnexAI

## Live Demo

[Click here to view the live demo](https://pixnex.flickdesk.tech)

## Description

PixnexAI is an AI-powered image generation and manipulation SaaS web application built with the MERN stack. It uses the Clipdrop API to provide multiple AI-powered image tools including text-to-image generation, background removal, image upscaling, cleanup, text removal, background replacement, and uncrop features with a secure login/signup system.

---

## Features

- **AI-based image generation** using the Clipdrop API
- **Cleanup** - Remove unwanted objects from images
- **Image Upscaling** - Enhance image quality and resolution
- **Remove Background** - Automatically remove backgrounds
- **Remove Text** - Intelligently remove text from images
- **Replace Background** - Replace backgrounds with AI-generated scenes
- **Uncrop** - Extend image borders with AI-generated content
- User authentication system with login and signup functionality
- Credit-based system for managing API usage
- Clean and modern user interface with smooth animations

---

## Installation Instructions

1. Clone the repository:

```bash
git clone https://github.com/shubhammauryainfo/pixnexAI.git
```

2. Navigate to the project directory:

```bash
cd pixnexAI
```

### Server Setup

3. Navigate to the server folder:

```bash
cd server
```

4. Install dependencies:

```bash
npm install
```

5. Configure environment variables:
   Create a `.env` file in the `server` folder and add the following:

   ```env
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   CLIPDROP_API=<your-clipdrop-api-key>
   PORT=5000
   ```

6. Start the server:

```bash
npm start
```

### Client Setup

7. Navigate to the client folder:

```bash
cd client
```

8. Install dependencies:

```bash
npm install
```

9. Configure environment variables:
   Create a `.env` file in the `client` folder and add the following:

   ```env
   VITE_BACKEND_URL=<url-for-server-side>
   ```

10. Start the client:

```bash
npm run dev
```

---

## Commands Summary

### Server Commands

- **Install dependencies:** `npm install`
- **Run the server:** `npm start`

### Client Commands

- **Install dependencies:** `npm install`
- **Run the client:** `npm run dev`

---

## Environment Variables Summary

### Server Folder

- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JSON Web Token.
- `CLIPDROP_API`: API key for the Clipdrop API.
- `PORT`: Server port (default: 5000).

### Client Folder

- `VITE_BACKEND_URL`: URL of the server application (e.g., http://localhost:5000).

---

Feel free to reach out for further assistance or feature suggestions!
