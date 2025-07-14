import React, { useState } from "react";
import bg from "../assets/bg-img.jpg";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { useContext } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SignIn = () => {
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    console.log(userData);
    setLoading(true);
    e.preventDefault();

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      setUserData(result.data);
      toast.success(result.data.message);
      navigate("/customize");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {!userData && (
        <div
          className="w-full h-[100vh] bg-cover flex items-center justify-center"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <form
            className="w-[90%] h-[600px] max-w-[500px] bg-[#00000029] backdrop-blur shadow-lg shadow-blue-950 flex flex-col items-center justify-center text-white px-6 gap-8"
            onSubmit={handleSignIn}
          >
            <h1 className="font-semibold text-xl ">
              Login to <span className="text-blue-500 font-bold ">Sansk</span>
            </h1>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border w-full h-[50px] outline-none rounded-md px-4 bg-transparent placeholder-gray-300"
              placeholder="Enter Your Email"
            />
            <div className="w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-full h-[50px] outline-none rounded-md px-4 bg-transparent placeholder-gray-300"
                placeholder="Enter Your Password"
              />
              {showPassword ? (
                <FaRegEyeSlash
                  className="absolute top-[18px] right-[12px] text-white"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <FaRegEye
                  className="absolute top-[18px] right-[12px] text-white"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            <button
              className="min-w-[150px] bg-blue-600 px-4 py-2 rounded-md cursor-pointer flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <AiOutlineLoading3Quarters className="" /> : "Sign In"}
            </button>
            <p>
              Dont haven't account ?{" "}
              <span className="text-blue-500">
                <Link to={"/signup"}>Register</Link>
              </span>
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default SignIn;
