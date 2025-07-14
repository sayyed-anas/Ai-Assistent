import axios from "axios";
import React, { createContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const serverUrl = "https://sanskvirtual-assistantbackend.onrender.com";

  const handleCurrentUser = async () => {
    setLoading(true);
    try {
      const currentUser = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(currentUser.data);
      navigate("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getGiminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <div>
      <userDataContext.Provider
        value={{
          serverUrl,
          userData,
          setUserData,
          frontendImage,
          setFrontendImage,
          backendImage,
          setBackendImage,
          selectedImage,
          setSelectedImage,
          loading,
          setLoading,
          getGiminiResponse,
        }}
      >
        {children}
      </userDataContext.Provider>
    </div>
  );
};

export default UserContext;
