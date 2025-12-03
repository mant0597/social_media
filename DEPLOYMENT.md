# Deployment Guide (Full Stack on Vercel)

## 1. Database (MongoDB Atlas)
**Required**: You must have a MongoDB connection string.
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster.
3.  Get the connection string (URI).

## 2. Deploy to Vercel
1.  Push your code to GitHub.
2.  Go to [Vercel](https://vercel.com) and "Add New Project".
3.  Import your GitHub repository.
4.  **Project Settings**:
    - **Framework Preset**: Vite (or Other).
    - **Root Directory**: `.` (Leave as default).
    - **Build Command**: `npm run build` (This will build both backend and frontend).
    - **Output Directory**: `frontend/dist` (Important! This is where the frontend build goes).
5.  **Environment Variables**:
    - `MONGO_URI`: (Your MongoDB Atlas URI).
    - `JWT_SECRET`: (Your secret key).
    - `VITE_API_URL`: `/api` (This points the frontend to the backend functions).
6.  Deploy!

## 3. Submission
- **Deployed Link**: Share the Vercel URL.
- **Upload**: Zip the `inkle_assignment` folder (exclude `node_modules`).
