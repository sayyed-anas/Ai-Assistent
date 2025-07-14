import { userDataContext } from "../context/UserContext";
import { useContext } from "react";

const Card = ({ image }) => {
  const { setFrontendImage, setBackendImage, selectedImage, setSelectedImage } =
    useContext(userDataContext);

  return (
    <div
      className={`w-[160px] h-[200px] rounded-xl hover:shadow-blue-900 hover:shadow-2xl hover:border-4 hover:border-white cursor-pointer ${
        selectedImage === image
          ? "border-4 border-white shadow-2xl shadow-blue-900"
          : null
      } `}
      onClick={() => {
        console.log(image);
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img
        className="h-full object-cover rounded-xl"
        src={image}
        alt="Ai image"
      />
    </div>
  );
};

export default Card;
