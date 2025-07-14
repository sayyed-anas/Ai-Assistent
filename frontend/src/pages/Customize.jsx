import Card from "../components/Card";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";
import image6 from "../assets/image6.jpg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useContext, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

const Customize = () => {
  const inputImage = useRef();
  const navigate = useNavigate();

  const {
    frontendImage,
    setFrontendImage,
    userData,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <>
      <div className="w-full min-h-[100vh] bg-gradient-to-t from-black to-blue-800 flex flex-col items-center justify-center gap-6 relative py-10">
        <MdKeyboardBackspace
          className="text-white w-[25px] h-[25px] absolute top-[20px] left-[20px] md:top-[30px] md:left-[30px] cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        />
        <h1 className="text-white font-bold text-2xl">
          Select Your Assistant Image
        </h1>
        <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 place-items-center">
          <Card image={image1} />
          <Card image={image2} />
          <Card image={image3} />
          <Card image={image4} />
          <Card image={image5} />
          <Card image={image6} />

          <div
            className={`w-[160px] bg-transparent h-[200px] flex items-center justify-center border-white border-1 rounded-xl hover:shadow-blue-900 hover:shadow hover:border-4 hover:border-white cursor-pointer ${
              selectedImage === "input"
                ? "border-4 border-white shadow-2xl shadow-blue-900"
                : null
            }`}
            onClick={() => {
              inputImage.current.click(), setSelectedImage("input");
            }}
          >
            {frontendImage ? (
              <img
                className="w-full h-full object-cover rounded-xl"
                src={frontendImage}
                alt="Ai Image"
              />
            ) : (
              <FaCloudUploadAlt className="text-white w-[30px] h-[30px]" />
            )}
          </div>

          <input
            className="hidden"
            type="file"
            accept="image/*"
            ref={inputImage}
            onChange={handleImage}
          />
        </div>
        {selectedImage && (
          <button
            className="bg-white cursor-pointer text-black px-4 py-2 rounded-full"
            onClick={() => navigate("/customize2")}
          >
            Next
          </button>
        )}
      </div>
    </>
  );
};

export default Customize;
