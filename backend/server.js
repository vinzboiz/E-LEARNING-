require("dotenv").config();
const express = require("express");
const app = express();

// Middlewares
app.use(express.json());

const assignmentModel = require("./models/assignment.model");
// Gọi 1 lần khi server khởi động
assignmentModel.cronUpdateAssignments();

// Import routes
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const roleRoutes = require("./routes/role.route");
const subjectRoutes = require("./routes/subject.route");
const courseRoute = require("./routes/course.route");
const classmemberRoute = require("./routes/classmember.route");
const registerCourseRoute = require('./routes/registercourse.route');
const coursescheduleRoutes = require("./routes/courseschedule.route");
const lessonRoutes = require("./routes/lesson.route");
const assignmentRoutes = require("./routes/assignment.route");
const submissionRoutes = require("./routes/submission.route");

// Setup routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/course", courseRoute);
app.use('/api/registercourse', registerCourseRoute);
app.use("/api/classmember", classmemberRoute);
app.use("/api/courseschedules", coursescheduleRoutes);
app.use("/api/lesson", lessonRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/submission", submissionRoutes);

// Root route (test server)
app.get("/", (req, res) => {
  res.json({ message: "E-Learning API is running 🚀" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
