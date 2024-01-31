import express from 'express';
import { getUsers, getUser, postUser, putUser, deleteUser, userValidator, validatePutUser } from '../controllers/users.js'

const usersRouter = express.Router();

usersRouter.get("/", getUsers)
usersRouter.get("/:id", getUser)
usersRouter.post("/", userValidator(), postUser)
usersRouter.put("/:id", validatePutUser(), putUser)
usersRouter.delete("/:id", deleteUser)

export default usersRouter;