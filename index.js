import dotenv from "dotenv";
import app from "./app.js";
import connectDb from "./src/config/connectDb.js";

dotenv.config({
  path:""
})
const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
