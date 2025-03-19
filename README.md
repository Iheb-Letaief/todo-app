# Todo App Project Setup Guide

This guide will walk you through the steps to set up and run the Todo App project locally on your machine.

## Prerequisites

- Node.js installed on your system.
- pnpm installed (optional, but recommended for the frontend).
- A code editor (e.g., Visual Studio Code).

## Setup Instructions

### 1. Backend Environment Setup

1. Navigate to the `backend` directory.
2. Create a `.env` file in the `backend` directory.
3. Add the following environment variables to the `.env` file:

   ```env
   MONGO_URI=mongodb+srv://admin:gHCKA9vp@cluster0.tcvclhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=5575b7f7828495c2a5deacf921fa1dd936b1bf0ffb1385e557154c6f966634c0
   EMAIL_USER=ihebeltaief123@gmail.com
   EMAIL_PASS="mhbo mbpr xbjp qwmg"
   FRONTEND_URL=http://localhost:3000
   ```


### 2. Frontend Environment Setup

1. Navigate to the `todo-app` directory (the project root for the frontend).
2. Create a `.env.local` file in the `todo-app` directory.
3. Add the following environment variable to the `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

## Running the Application

### Start the Backend Server

1. Ensure you are in the `backend` directory.
2. Install dependencies (if not already installed):

   ```bash
   npm install
   ```

3. Run the backend server:

   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`.

### Start the Frontend Server

1. Ensure you are in the `todo-app` directory.
2. Install dependencies (if not already installed):

   ```bash
   pnpm install
   ```

   (Recommended for better performance) If you don’t have `pnpm`, install it globally first:

   ```bash
   npm install -g pnpm
   ```

3. Run the frontend development server:

   ```bash
   pnpm run dev
   ```

   The frontend will run on `http://localhost:3000`.

## Access the Application

- Open your browser and navigate to `http://localhost:3000` to use the Todo App.
- Ensure both the backend and frontend servers are running simultaneously for full functionality.
- Admin credentials for testing the admin dashboard:
  admin@gmail.com | admin123

## Notes

- **Backend Port:** The backend uses port `5000`. Ensure this port is free or update the `.env` and `.env.local` files if you change it.
- **Security Warning:** The provided credentials are for development purposes only. For production, replace them with secure values and avoid exposing sensitive data.
- **Troubleshooting:** If you encounter issues, verify that all environment variables are correctly set and that there are no typos in the files.

