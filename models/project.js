import mongoose from "mongoose";

const { Schema } = mongoose;

const projectSchema = new Schema({
  projectId: {
    type: String,
   
  },
  projectType: {
    type: String,
    required: true
  },
  projectLocation: {
    type: String,
   
  },
  city: {
    type: String,
   
  },
  pincode: {
    type: String,
    required: true
  },
  services: {
    type: [String],
    required: true
  },
  imageUrl: {
    type: String
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3, 4],
    default: 1 // Default status set to "in process"
  },
  assignedWorkers: [{
    workerId: {
      type: Schema.Types.ObjectId,   
      ref: 'worker', // Reference to the Worker model if needed
      required: true
    },
  
  }]
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
