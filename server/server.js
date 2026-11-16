
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Home route
app.get("/", (req, res) => {
  res.send("TaskFlow API is running!");
});

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
// Error handling middleware
app.use(notFound);
app.use(errorHandler);
app.use(cors({
  origin: "https://task-flow-three-azure.vercel.app",
  credentials: true
}));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
