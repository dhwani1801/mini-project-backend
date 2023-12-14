import express from 'express';
import {xeroController} from '../controllers';

const router = express.Router();

router.get("/getxerourl",xeroController.connectToXero);
router.post("/callback",xeroController.callback);

export default router;