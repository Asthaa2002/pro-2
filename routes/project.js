import express from 'express';
import {ongoingProjects,assignWorkersToProject ,removeWorkerFromProject, getProjects } from '../controllers/project.js'; 

const router = express.Router();

router.post('/create_project', ongoingProjects ); 
router.post('/assign_worker/:id', assignWorkersToProject )
router.delete('/remove/assigned_worker/:projectId/:workerId',removeWorkerFromProject)
router.get("/get/project", getProjects)


export default router;
