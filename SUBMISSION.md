# Social Activity Feed - Submission

## Project Summary
This project is a full-stack social activity feed application built with **Node.js, Express, MongoDB** (Backend) and **React, Vite** (Frontend). It replicates core features of social platforms like Instagram, allowing users to connect, share, and interact.

### Key Features
- **Authentication**: Secure Signup/Login with JWT.
- **Social Graph**: Follow/Unfollow system with "Follow Requests" for privacy.
- **Activity Feed**:
    - **Personal Feed**: Shows activities from followed users.
    - **Global Wall**: Shows all activities across the network (Posts, Follows, Likes).
- **Interactions**: Create posts, like posts, and block users.
- **Admin/Owner Dashboard**:
    - Admins can delete users and posts.
    - Owners can manage Admin roles.
    - Dedicated UI for managing users.
- **Search**: Find users by username.

## Approach
1.  **Backend First**: Designed the Schema (User, Post, Activity) to support a scalable feed. Used an "Activity" model to log every action (`post_created`, `user_followed`, `post_liked`), making it easy to generate diverse feeds.
2.  **Frontend Design**: Built a clean, Instagram-inspired UI using React. Focused on usability with a card-based feed and intuitive profile management.
3.  **Role-Based Access**: Implemented middleware to enforce `admin` and `owner` permissions securely.

## Challenges & Solutions
- **Feed Logic**: Efficiently filtering the feed to exclude blocked users and only show relevant activities was complex. *Solution*: Implemented robust query filtering in the `getFeed` controller to exclude `blockedUsers` from the result set.
- **Follow Requests**: Differentiating between "Direct Follow" and "Requested" states. *Solution*: Added a `followRequests` array to the User model and created specific API endpoints (`accept`, `reject`) to handle this flow.

## How to Run
1.  **Backend**:
    ```bash
    npm install
    npm run seed  # Generates default Admin/Owner accounts
    npm start
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Credentials
- **Owner**: `owner` / `123456`
- **Admin**: `admin` / `123456`
- **User**: `user1` / `123456`
