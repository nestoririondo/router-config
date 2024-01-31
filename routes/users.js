import express from 'express';
import { getUsers, getUser, postUser, userValidator } from '../controllers/users.js'

const usersRouter = express.Router();

usersRouter.get("/", getUsers)
usersRouter.get("/:id", getUser)
usersRouter.post("/", userValidator(), postUser)

export default usersRouter;