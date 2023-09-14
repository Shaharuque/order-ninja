import { Router } from "express";
import { getOtp, createOtp } from "../controllers/otp.controller";
import { registerConfirm, registrationRequest } from "../controllers/registration.controller";

const registrationRouter = Router();

registrationRouter.post('/request', registrationRequest);
registrationRouter.post('/confirm', registerConfirm);


export default registrationRouter;