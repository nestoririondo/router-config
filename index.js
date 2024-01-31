import express from "express";
import usersRouter from "./routes/users.js";

const app = express();
const port = 3333;

app.use(express.json());

app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
