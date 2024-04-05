import userSchema from "../models/user.js";
import mongoose from "mongoose";

export const addAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const { addresses } = req.body;
    const user = await userSchema.findById(id);
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    if (!user.addresses) {
      user.addresses = [];
    }
    console.log(req.body);
    if (!Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ message: "Invalid addresses data" });
    }

    user.addresses.push(...addresses);


    await user.save();

    res.status(200).json({ message: "Addresses added", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const retrieve_addresses = async (req, res) => {
  try {
    const partnerId = req.params.partnerId;
    const user = await userSchema.findById(partnerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addresses = user.addresses;
    return res.json({ message: "Addresses retrieved successfully", addresses });
  } catch (error) {
    console.error('Error retrieving addresses:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateAddress = async (req, res) => {
  const userId = req.params.userId;
  const addressId = req.params.addressId;
  try {
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid user ID or address ID!" });
    }

    let user = await userSchema.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const addressIndex = user.addresses.findIndex(
      (address) => address._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found!" });
    }

    const addressToUpdate = user.addresses[addressIndex];
    addressToUpdate.address = updatedData.address || addressToUpdate.address;
    addressToUpdate.state = updatedData.state || addressToUpdate.state;
    addressToUpdate.pincode = updatedData.pincode || addressToUpdate.pincode;
    addressToUpdate.location.coordinates = [
      updatedData.longitude || addressToUpdate.location.coordinates[0],
      updatedData.latitude || addressToUpdate.location.coordinates[1]
    ];

    await user.save();

    return res.status(200).json({ message: "Address updated successfully", updatedAddress: addressToUpdate });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
