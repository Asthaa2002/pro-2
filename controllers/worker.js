import workerSchema from "../models/worker.js";
import geolib from "geolib";
import axios from 'axios';


export const addWorker = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      gender,
      services,
      yearsOfExp,
      address,
      state,
      pincode,
    } = req.body;

    if (!firstName || !phone || !yearsOfExp || !address || !pincode) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid phone number" });
    }
    if (!Number.isInteger(yearsOfExp) || yearsOfExp < 0) {
      return res
        .status(400)
        .json({
          message: "Please provide a valid value for years of experience",
        });
    }

    const newWorker = new workerSchema({
      firstName,
      lastName,
      phone,
      gender,
      services,
      yearsOfExp,
      address,
      state,
      pincode,
    });

    const savedWorker = await newWorker.save();

    return res.status(201).json({
      message: "Worker added successfully",
      worker: savedWorker,
    });
  } catch (error) {
    console.error("Error adding worker:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getNearByWorker = async (req, res) => {
  try {
    const { pincode, services } = req.query;

    // Validate pincode
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
      return res.status(400).json({ message: "Please provide a valid pincode" });
    }

    // Get the coordinates (latitude and longitude) of the provided pincode
    const pincodeCoordinates = await getCoordinatesFromPincode(pincode);
    console.log(pincodeCoordinates)


    if (!pincodeCoordinates) {
      return res.status(404).json({ message: "No coordinates found for the provided pincode" });
    }

    // Retrieve workers from the database
    const workers = await workerSchema.find();
    console.log(workers)

    // Check if workers were retrieved
    if (!workers || workers.length === 0) {
      return res.status(404).json({ message: "No workers found in the database" });
    }

    // Filter workers based on distance and services
    let nearbyWorkers = workers.filter((worker) => {
      const workerDistance = geolib.getDistance(
        {
          latitude: pincodeCoordinates.latitude,
          longitude: pincodeCoordinates.longitude,
        },
        {
          latitude: parseFloat(worker.latitude),
          longitude: parseFloat(worker.longitude),
        }
      );
      // Assuming a maximum distance of 10 kilometers (adjust as needed)
      return workerDistance <= 10000 && (!services || worker.services.includes(services));
    });

    return res.status(200).json({
      message: "Workers in the nearby area retrieved successfully",
      workers: nearbyWorkers,
    });
  } catch (error) {
    console.error("Error retrieving nearby workers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

async function getCoordinatesFromPincode(pincode) {
  try {
    // Make a GET request to the geocoding service API with the pincode
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=AIzaSyCsWl0WWqdFlO0fIpffccE6dtA_IwWqf6M`);

    // Check if the response is successful and contains results
    if (response.data && response.data.results.length > 0) {
      // Extract the latitude and longitude from the response
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      // Handle case where no results are found
      return null;
    }
  } catch (error) {
    // Handle errors, such as network issues or API errors
    console.error('Error fetching coordinates:', error);
    return null;
  }

}


