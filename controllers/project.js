import projectSchema from "../models/project.js";
import workerSchema from "../models/worker.js";
// import ShortUniqueId from 'short-unique-id';

export const ongoingProjects = async (req, res) => {
  try {
    const { projectType, projectLocation, city, pincode, services, imageUrl } =
      req.body;
    // const uid = new ShortUniqueId({ length: 10 });
    // const unId = uid();

    // Set status to "in process" (status code 1) for ongoing projects
    const status = 1;

    // Create a new project object
    const newProject = new projectSchema({
      projectType,
      projectLocation,
      city,
      pincode,
      services,
      imageUrl,
      status,
    });

    const savedProject = await newProject.save();

    return res
      .status(201)
      .json({
        message: "Ongoing project created successfully",
        project: savedProject,
      });
  } catch (error) {
    console.error("Error creating ongoing project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await projectSchema.find().populate('assignedWorkers.workerId')
    if (!projects) {
      return res.status(404).json({ message: "No project in db" });
    }
    return res
      .status(200)
      .json({
        message: "Project fetched !", projects
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const assignWorkersToProject = async (req, res) => {
  const { id } = req.params;
  try {
    const { workerId } = req.body;

    // Validate project ID
    if (!id) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    // Check if the project exists
    const project = await projectSchema.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Retrieve workers from the database
    const workers = await workerSchema.find({ _id: { $in: workerId } });
    if (!workers || workers.length === 0) {
      return res
        .status(404)
        .json({ message: "No workers found with the provided IDs" });
    }

    // Map worker information to project's assignedWorkers array
    const assignedWorkers = workers.map((worker) => ({
      workerId: worker._id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      phone: worker.phone,
      gender: worker.gender,
      services: worker.services,
      yearsOfExp: worker.yearsOfExp,
      address: worker.address,
      state: worker.state,
      pincode: worker.pincode,
    }));

    // Assign workers to the project
    project.assignedWorkers.push(...assignedWorkers);

    console.log(assignedWorkers);

    // Save the updated project
    await project.save();

    return res
      .status(200)
      .json({
        message: "Workers assigned to the project successfully",
        project,
      });
  } catch (error) {
    console.error("Error assigning workers to project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeWorkerFromProject = async (req, res) => {
  try {
    const { projectId, workerId } = req.params;

    // Validate project ID and worker ID
    if (!projectId || !workerId) {
      return res.status(400).json({ message: "Project ID and Worker ID are required" });
    }

    // Check if the project exists
    const project = await projectSchema.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Find the index of the worker to remove
    const index = project.assignedWorkers.findIndex(worker => String(worker.workerId) === workerId);
    if (index === -1) {
      return res.status(404).json({ message: "Worker not found in the project" });
    }

    // Remove the worker from the assignedWorkers array
    project.assignedWorkers.splice(index, 1);

    // Save the updated project
    await project.save();

    return res.status(200).json({
      message: "Worker removed from the project successfully",
      project,
    });
  } catch (error) {
    console.error("Error removing worker from project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
