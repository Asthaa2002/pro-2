import express from 'express';
import { addWorker, getNearByWorker } from '../controllers/worker.js'; 

const router = express.Router();

router.post('/add_worker', addWorker); 
router.get('/get_nearby_worker', getNearByWorker)


export default router;
