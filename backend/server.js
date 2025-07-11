const express = require('express');
const dotenv = require('dotenv');
const subjectRoutes = require('./routes/subject.route');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/subjects', subjectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
