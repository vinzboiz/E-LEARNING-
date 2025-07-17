require("dotenv").config();
const express = require("express");
const app = express();

// Middlewares
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const roleRoutes = require("./routes/role.route");
const subjectRoutes = require("./routes/subject.route");
const courseRoute = require("./routes/course.route");
const classmemberRoute = require("./routes/classmember.route");
const registerCourseRoute = require('./routes/registercourse.route');
const coursescheduleRoutes = require("./routes/courseschedule.route");

// Setup routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/course", courseRoute);
app.use('/api/registercourse', registerCourseRoute);
app.use("/api/classmember", classmemberRoute);
app.use("/api/courseschedules", coursescheduleRoutes);

// Root route (test server)
app.get("/", (req, res) => {
  res.json({ message: "E-Learning API is running 🚀" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
