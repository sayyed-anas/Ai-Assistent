import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/auth.model.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    return res.status(200).json({ message: "User Found", user });
  } catch (error) {
    return res.status(500).json({ message: "Get user Error:- ", error });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    const userId = req.userId;
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Assistant Created Successfully.", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Assistant Error:- ", error });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = await req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const user = await User.findById(userId);

    user.history.push(command);
    user.save();

    const result = await geminiResponse(
      command,
      user.assistantName,
      user.fullname
    );

    const jsonMatch = result.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res.status(400).json({ Response: "Sorry, i can't understand" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    console.log(gemResult);

    const type = gemResult.type;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current Date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current Tme is ${moment().format("hh:mm A")}`,
        });

      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `This month is ${moment().format("MMMM")}`,
        });

      case "general":
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res
          .status(400)
          .json({ response: "i did not understand that command" });
    }
  } catch (error) {
    return res.status(500).json({ response: "ask assistant error :-", error });
  }
};
