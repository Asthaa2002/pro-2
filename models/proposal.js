
import mongoose from "mongoose";

const { Schema } = mongoose;


const propertyDetailsSchema = new Schema({
  livingRooms: {
    totalRooms: { type: Number, required: true },
    totalArea: { type: Number, required: true }
  },
  kitchens: {
    totalRooms: { type: Number, required: true },
    totalArea: { type: Number, required: true }
  },
  bedrooms: {
    totalRooms: { type: Number, required: true },
    totalArea: { type: Number, required: true }
  },
  toilets: {
    totalRooms: { type: Number, required: true },
    totalArea: { type: Number, required: true }
  },
  bathrooms: {
    totalRooms: { type: Number, required: true },
    totalArea: { type: Number, required: true }
  }
});

const proposalSchema = new Schema({
//     userRequestId: {
//  type: mongoose.Schema.Type.ObjectId,
//  ref: "UserRequest"
//     },
  propertyType: {
    type: String,
    enum: ['residence', 'commercial'],
    // required: true
  },
  propertySpaceType: {
    type: String,
    // required: true
  },
  propertyDetails: {
    type: propertyDetailsSchema,
    required: true
  },
  isOutdoor: {
    type: Boolean,
    required: true
  },
  totalOutdoorArea: {
    type: Number,
    required: true
  },
  requiredServices: {
    type: [String],
    required: true
  },
  additionalServices: {
    type: [String]
  },
  status: {
    type: String,
    enum: ['Created', 'Rejected', 'Accepted'],
    default: 'Created'
  }
});

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;
