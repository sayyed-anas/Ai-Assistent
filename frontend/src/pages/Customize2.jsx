import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    setFrontendImage,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    serverUrl,
  } = useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistentName || ""
  );

  const handleUpdateAssistant = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("assistantName", assistantName);
    if (backendImage) {
      formData.append("assistantImage", backendImage);
    } else {
      formData.append("imageUrl", selectedImage);
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success(result.data.message);
      setUserData(result.data);
      console.log(result.data);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100vh] bg-gradient-to-t from-black to-blue-800 flex flex-col items-center justify-center gap-6 relative">
      <MdKeyboardBackspace
        className="text-white w-[25px] h-[25px] absolute top-[20px] left-[20px] md:top-[30px] md:left-[30px] cursor-pointer"
        onClick={() => navigate("/customize")}
      />
      <h1 className="text-white font-bold text-2xl text-center">
        Enter Your Assistant Name
      </h1>
      <div className="w-full px-6 flex items-center justify-center">
        <input
          value={assistantName}
          type={"text"}
          className="max-w-[600px] border-1 border-white text-white w-full h-[50px] outline-none rounded-md px-4 bg-transparent placeholder-gray-300"
          placeholder="ex-Jarvis"
          onChange={(e) => {
            setAssistantName(e.target.value);
          }}
        />
      </div>
      {assistantName && (
        <button
          className="bg-white cursor-pointer text-black px-4 py-2 rounded-full hover:bg-[#ffffffd0]"
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {loading ? "loading...." : "Finally Create Your Assistent"}
        </button>
      )}
    </div>
  );
};

export default Customize2;
