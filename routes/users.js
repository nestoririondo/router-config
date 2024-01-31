import express from 'express';
import { getUsers, getUser, postUser, putUser, deleteUser } from '../controllers/users.js'
import { userValidator, validatePutUser, checkUser } from '../middlewares/users.js'

const usersRouter = express.Router();

usersRouter.get("/", getUsers)
usersRouter.get("/:id", checkUser, getUser)
usersRouter.post("/", userValidator(), postUser)
usersRouter.put("/:id", checkUser, validatePutUser(), putUser)
usersRouter.delete("/:id", checkUser, deleteUser)

export default usersRouter;