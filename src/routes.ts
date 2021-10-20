import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetMessagesController } from "./controllers/GetMessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { Authentication } from "./middlewares/authentication";

export const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle);

router.post("/messages", Authentication, new CreateMessageController().handle)
router.get("/messages/last3", new GetMessagesController().handle)
router.get("/profile", Authentication, new ProfileUserController().handle)
