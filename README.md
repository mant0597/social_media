# Social Activity Feed - Inkle Assignment

## Backend Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Build the Project**:
    This compiles the TypeScript code into the `dist` folder.
    ```bash
    npm run build
    ```

3.  **Run the Server**:
    ```bash
    npm start
    ```
    Or for development with auto-reload:
    ```bash
    npm run dev
    ```

    **Environment Variables**:
    Ensure `.env` exists with:
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/social-feed
    JWT_SECRET=your_jwt_secret
    ```

## Frontend Setup

1.  **Navigate to Frontend Directory**:
    ```bash
    cd frontend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Frontend**:
    ```bash
    npm run dev
    ```

## Features

- **Auth**: Beautiful Login/Signup pages inspired by modern design tools.
- **Feed**: View activity feed (posts, follows, likes).
- **Posts**: Create posts.
- **Social**: Follow users by ID.
- **Admin**: Backend APIs available for admin actions.

## Testing
- Use the frontend to interact with the app.
- Use Postman (`postman_collection.json`) for advanced API testing.
