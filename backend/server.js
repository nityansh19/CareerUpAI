const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(express.json());

// User routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("CareerUp AI Backend is Running!");
});

app.listen(PORT, () => {
  console.log(`CareerUp AI Backend running on http://localhost:${PORT}`);
});