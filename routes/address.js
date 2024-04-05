import express from 'express';
import { addAddress, retrieve_addresses, updateAddress } from '../controllers/address.js';

const router = express.Router();

router.post('/address/:id', addAddress);
router.get('/address/:userId', retrieve_addresses);
router.put('/address/:userId/:addressId', updateAddress);

export default router;
