import express from 'express';
import { getUsers, getUser, postUser, putUser, userValidator } from '../controllers/users.js'

const usersRouter = express.Router();

usersRouter.get("/", getUsers)
usersRouter.get("/:id", getUser)
usersRouter.post("/", userValidator(), postUser)
usersRouter.put("/:id", putUser)

export default usersRouter;