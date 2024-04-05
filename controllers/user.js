import bcrypt from "bcryptjs";
import userSchema from "../models/user.js";

export const userSignup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Please fill all the required fields!" });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({ message: "Password should be at least 8 characters long" });
        }

        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPwd = await bcrypt.hash(password, 12);

        const newUser = new userSchema({
            email,
            password: hashedPwd,
        });

        const result = await newUser.save();
        console.log(result);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
  }