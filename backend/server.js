import express from "express"
import dotenv from 'dotenv';
import {connectdb} from "./lib/db.js"
import authRoutes from "./routes/auth.route.js"


dotenv.config();


const app = express();
app.use(express.json());
const PORT = process.env.PORT

app.use("/api/auth", authRoutes);


connectdb()
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});