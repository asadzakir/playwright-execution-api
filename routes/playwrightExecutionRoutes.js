import express from 'express';
import {
  execution,
} from '../controllers/playwrightExecutionController.js';

const router = express.Router();

router.post('/exe', execution);


export default router;
