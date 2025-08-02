import mongoose from "mongoose";
import User from "../models/auth.model.js";
import bcryptjs from "bcryptjs";
import generateToken from "../config/token.js";

//Signup Section Code
export const signUp = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const existEmail = await User.findOne({ email });

    if (!fullname || !email || !password) {
      return res.status(404).json({ message: "All fields are required!" });
    }

    if (existEmail) {
      return res.status(400).json({ message: "User Already Exists!" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password Must be atleast 6 characters !" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    if (!hashedPassword) {
      return res
        .status(400)
        .json({ message: "Something went wrong in hashing the password" });
    }

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(201).json({ message: "User Created Successfully", user });
  } catch (error) {
    return res.status(404).json({ message: `SignUp Error ${error}` });
  }
};

// Login Section Code
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }

    const isMatchPassword = await bcryptjs.compare(password, user.password);

    if (!isMatchPassword) {
      return res
        .status(400)
        .json({ message: "Please enter the correct password!" });
    }

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({ message: "Login Successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: `Login Error ${error}` });
  }
};

export const logOut = (req, res) => {
  try {
    res.clearCookie("token",{
  httpOnly: true,
  secure: true,
  sameSite: "None",
});
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Logout Error ${error}` });
  }
};
