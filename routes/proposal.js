import express from "express";
import {PDF_invoice, createProposal, updateProposal}  from "../controllers/proposal.js"


const router = express.Router();

router.post('/create_proposal', createProposal);
router.put('/update_proposal/:proposalId',updateProposal);
router.get('/proposal_pdf/:proposalId',PDF_invoice)


export default router;