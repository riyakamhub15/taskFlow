# TaskFlow – Full-Stack Project & Task Management Platform

TaskFlow is a full-stack project and task management application built using the MERN stack. It helps users organize projects, manage tasks, track progress, and improve productivity through a centralized dashboard.

## Features

- User registration and login
- JWT-based authentication
- Create, read, update and delete projects
- Create, read, update and delete tasks
- Task status and priority management
- Search tasks by title
- Filter tasks by status and priority
- Dashboard with task statistics
- Protected API routes
- Responsive landing page and dashboard
- Backend validation and error handling

## Tech Stack

**Frontend**
- React.js
- React Router
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```text
taskflow/
├── client/
├── server/
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/riyakamhub15/taskFlow
cd taskflow
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Start the backend

```bash
npm run dev
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## Application Modules

1. Authentication and Authorization
2. Project Management
3. Task Management
4. Search and Filtering
5. Dashboard Statistics
6. Validation and Error Handling

## Future Enhancements

- Task deadline notifications
- Drag-and-drop task management
- Team collaboration
- Project progress visualization
- User profile management
- Deployment with a live application URL

## Author

Developed as a full-stack development project to demonstrate practical MERN stack skills.