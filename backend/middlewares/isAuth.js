import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = await req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }

    const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifiedToken.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "is Auth Error:- ", error });
  }
};

export default isAuth;
