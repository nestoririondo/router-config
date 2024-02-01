import 'dotenv/config';
import express from "express";
import usersRouter from "./routes/users.js";
import cors from "cors";

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());

app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
