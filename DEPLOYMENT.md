# Deployment Guide (Separate Backend & Frontend)

## 1. Backend Deployment (Render.com)

1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `mant0597/social_media`
4. **Settings**:
   - **Name**: `social-media-backend` (or any name)
   - **Root Directory**: Leave blank (`.`)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. **Environment Variables** (Click "Add Environment Variable"):
   - `MONGO_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Your secret key (e.g., `mysecretkey123`)
   - `PORT` = `5000`
6. Click "Create Web Service"
7. **IMPORTANT**: Copy the URL Render gives you (e.g., `https://social-media-backend.onrender.com`)

## 2. Update Frontend to Use Backend URL

After backend is deployed, you need to update your Vercel deployment:

1. Go to your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. **Edit** the `VITE_API_URL` variable:
   - Change from `/api` to `https://YOUR-RENDER-URL.onrender.com/api`
   - (Use the URL from Render step 7)
4. Go to "Deployments" tab
5. Click the three dots on the latest deployment → "Redeploy"

## 3. Test Your App

- Frontend: Your Vercel URL (e.g., `https://social-media.vercel.app`)
- Backend: Your Render URL (e.g., `https://social-media-backend.onrender.com/api`)

**Note**: First request to Render may be slow (free tier spins down after inactivity).
