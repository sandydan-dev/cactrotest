const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// connection
const connectDB = require("./config/db.connection");
connectDB()
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
