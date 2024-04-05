import proposalSchema from "../models/proposal.js";
import PDFDocument from 'pdfkit';
import fs from 'fs'

export const createProposal = async (req, res) => {
    try {
        // Extract request body data
        const { userRequestId, propertyType, propertySpaceType, isOutdoor, totalOutdoorArea, requiredServices, additionalServices } = req.body;
        
        // Default propertyDetails
        const defaultPropertyDetails = {
            livingRooms: { totalRooms: 0, totalArea: 0 },
            kitchens: { totalRooms: 0, totalArea: 0 },
            bedrooms: { totalRooms: 0, totalArea: 0 },
            toilets: { totalRooms: 0, totalArea: 0 },
            bathrooms: { totalRooms: 0, totalArea: 0 }
        };
        
        // Merge default propertyDetails with provided propertyDetails, if any
        const propertyDetails = req.body.propertyDetails ? Object.assign(defaultPropertyDetails, req.body.propertyDetails) : defaultPropertyDetails;
        
        // Create a new Proposal instance
        const proposal = new proposalSchema({
            userRequestId,
            propertyType,
            propertySpaceType,
            propertyDetails,
            isOutdoor,
            totalOutdoorArea,
            requiredServices,
            additionalServices,
            status: 'Created' // Set default status to 'Created'
        });
        
        // Save the proposal to the database
        await proposal.save();
        
        // Send a success response
        res.status(201).json({ success: true, message: 'Proposal created successfully', proposal });
    } catch (error) {
        // If there's an error, send an error response
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
}

export const updateProposal= async (req, res) => {
    try {
        const proposalId = req.params.proposalId; 
        const { userRequestId, propertyType, propertySpaceType, isOutdoor, totalOutdoorArea, requiredServices, additionalServices, propertyDetails } = req.body;

        // Find the proposal by ID
        const proposal = await proposalSchema.findById(proposalId);

        if (!proposal) {
            return res.status(404).json({ success: false, message: 'Proposal not found' });
        }

        // Update the proposal with the provided details
        proposal.userRequestId = userRequestId;
        proposal.propertyType = propertyType;
        proposal.propertySpaceType = propertySpaceType;
        proposal.isOutdoor = isOutdoor;
        proposal.totalOutdoorArea = totalOutdoorArea;
        proposal.requiredServices = requiredServices;
        proposal.additionalServices = additionalServices;
        proposal.propertyDetails = propertyDetails;
        await proposal.save();
        res.status(200).json({ success: true, message: 'Proposal updated successfully', proposal });
    } catch (error) {
        // If there's an error, send an error response
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};


export const PDF_invoice= async (req, res) => {
    try {
        const proposalId = req.params.proposalId; // Extract the proposal ID from the request parameters

        // Fetch the proposal from the database
        const proposal = await proposalSchema.findById(proposalId);

        if (!proposal) {
            return res.status(404).json({ success: false, message: 'Proposal not found' });
        }

        // Create a new PDF document
        const doc = new PDFDocument();

        // Set response headers to indicate PDF content
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="proposal_${proposalId}.pdf"`);

        // Pipe the PDF document to the response
        doc.pipe(res);

        // Add proposal details to the PDF
        doc.fontSize(20).text('Proposal Details', { align: 'center' }).moveDown();
        doc.fontSize(14).text(`Proposal ID: ${proposalId}`);
        doc.fontSize(14).text(`User Request ID: ${proposal.userRequestId}`);
        doc.fontSize(14).text(`Property Type: ${proposal.propertyType}`);
        doc.fontSize(14).text(`Property Space Type: ${proposal.propertySpaceType}`);
        // Add more details as needed...

        // End the PDF document
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};