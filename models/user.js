import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  addresses: [
    {
      address: String,
      state: String,
      pincode: String,
      location: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
        }
      }
    }
  ]
});

const User = mongoose.model("User", userSchema);

export default User;
