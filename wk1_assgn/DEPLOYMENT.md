# Render Deployment Guide

## Prerequisites
1. A Render account (https://render.com)
2. Your project pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### 1. Connect Your Repository
1. Log into Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub/GitLab repository
4. Select your `iot-68` repository

### 2. Configure the Web Service
- **Name**: `student-api` (or any name you prefer)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run migrate`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (or paid tier for better performance)

### 3. Set Environment Variables
In the Render dashboard, add these environment variables:
- `NODE_ENV`: `production`
- `DATABASE_URL`: (will be auto-generated when you create database)
- `API_SECRET`: Generate a secure random string
- `CORS_ORIGIN`: Your frontend URL (optional)

### 4. Create PostgreSQL Database
1. In Render dashboard, click "New +" → "PostgreSQL"
2. **Name**: `student-db` (or any name you prefer)
3. **Database Name**: `student_database`
4. **User**: `student_user`
5. Choose your plan (Free tier available)

### 5. Link Database to Web Service
1. Go back to your web service settings
2. In Environment Variables, set `DATABASE_URL` to your database's connection string
3. You can find this in your PostgreSQL database dashboard under "Connections"

### 6. Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Your API will be available at: `https://your-service-name.onrender.com`

## Alternative: Blueprint Deployment
You can use the included `render.yaml` file for one-click deployment:
1. In Render dashboard, click "New +" → "Blueprint"
2. Connect your repository
3. Render will automatically create both the web service and database

## Testing Your Deployment
Once deployed, test these endpoints:
- `GET https://your-service-name.onrender.com/api/health` - Health check
- `GET https://your-service-name.onrender.com/api/v1` - API root (requires authentication)

## Important Notes
- The free tier has limitations (spins down after inactivity)
- Database connections may timeout on free tier
- For production use, consider paid tiers for better reliability
- Your database will run migrations automatically during build

## Local Development
1. Copy `.env.example` to `.env`
2. Fill in your local database credentials
3. Run `npm run dev` to start development server

## Troubleshooting
- Check Render logs if deployment fails
- Ensure all environment variables are set correctly
- Verify database connection string format
- Make sure your repository is up to date
