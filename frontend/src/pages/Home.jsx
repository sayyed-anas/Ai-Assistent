import React, { useContext, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ai from "../assets/ai.gif";
import { RiMenu3Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import user from "../assets/user.gif";

const Home = () => {
  const { userData, setUserData, serverUrl, getGiminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const [aiText, setAiText] = useState(null);
  const [userText, setUserText] = useState(null);
  const [ham, setHam] = useState(false);

  const synth = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      setUserData(null);
      const result = await axios(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    isSpeakingRef.current = true;

    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };
    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook_open") {
      window.open(`https://facebook.com/`, "_blank");
    }
    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);

      window.open(
        ` https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.error("Speech recognition not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognitionRef.current = recognition;

      let isMounted = true;

      const startTimeout = setTimeout(() => {
        if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
          try {
            recognition.start();
          } catch (error) {
            if (error.name !== "InvalideStateError") {
              console.log(error);
            }
          }
        }
      }, 1000);

      recognition.onstart = () => {
        isRecognizingRef.current = true;
        setListening(true);
      };

      recognition.onend = () => {
        isRecognizingRef.current = false;
        setListening(false);

        if (isMounted && !isSpeakingRef.current) {
          setTimeout(() => {
            if (isMounted) {
              try {
                recognition.start();
              } catch (error) {
                if (error.name !== "InvalidStateError") {
                  console.log(error);
                }
              }
            }
          }, 1000);
        }
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e.error);
        isRecognizingRef.current = false;
        setListening(false);

        if (e.error !== "aborted" && isMounted && !isSpeakingRef.current) {
          setTimeout(() => {
            if (isMounted) {
              try {
                recognition.start();
              } catch (error) {
                if (error.name !== "InvalidStateError") {
                  console.log(error);
                }
              }
            }
          }, 1000);
        }
      };

      recognition.onresult = async (e) => {
        const transcript = e.results[e.results.length - 1][0].transcript.trim();

        if (
          transcript
            .toLowerCase()
            .includes(userData.user.assistantName.toLowerCase())
        ) {
          setAiText("");
          setUserText(transcript);
          recognition.stop();
          isRecognizingRef.current = false;
          setListening(false);

          const data = await getGiminiResponse(transcript);

          handleCommand(data);
          setAiText(data.response);
          setUserText("");
        }
      };

      const greeting = new SpeechSynthesisUtterance(
        `Hello ${userData.user.fullname}, what can i help you with?`
      );
      greeting.lang = "hi-IN";

      window.speechSynthesis.speak(greeting);

      return () => {
        isMounted = false;
        clearTimeout(startTimeout);
        recognition.stop();
        setListening(false);
        isRecognizingRef.current = false;
      };
    } catch (error) {
      toast.error(error.response.data.response);
    }
  }, []);

  return (
    <div className="w-full min-h-[100vh] bg-gradient-to-t from-black via-black to-blue-800 flex flex-col items-center justify-center relative overflow-hidden">
      <RiMenu3Line
        onClick={() => setHam(true)}
        className="text-white absolute top-[15px] right-[15px] lg:hidden w-[30px] h-[30px]"
      />
      <div
        className={`absolute top-0 bg-[#00000075] backdrop-blur-md w-full h-full p-[20px] lg:hidden ${
          ham ? "translate-x-0" : "translate-x-full"
        } transition-transform`}
      >
        <RxCross2
          onClick={() => setHam(false)}
          className="text-white absolute top-[15px] right-[15px] w-[30px] h-[30px]"
        />
        <div className="flex flex-col">
          <button
            className="min-w-[150px] mt-[50px] font-semibold text-[19px] bg-white cursor-pointer text-black px-4 py-2 rounded-full hover:bg-[#ffffffd0] "
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="min-w-[150px] mt-[10px] font-semibold text-[19px] bg-white cursor-pointer text-black px-4 py-2 rounded-full hover:bg-[#ffffffd0]"
            onClick={() => navigate("/customize")}
          >
            Customize your Assistant
          </button>
        </div>
        <div className="w-full h-[2px] bg-gray-400 mt-[10px]"></div>
        <h2 className="text-[19px] font-semibold text-white mt-[10px]">
          History
        </h2>
        <div className="w-full h-[60%] overflow-auto flex flex-col gap-[20px] mt-[10px]">
          {userData.user.history?.map((hist, index) => (
            <span key={index} className="text-white text-[19px]">
              {hist}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute top-[30px] right-[30px] flex flex-col gap-3 ">
        <button
          className="bg-white cursor-pointer text-black px-4 py-2 rounded-full hover:bg-[#ffffffd0] hidden lg:block"
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          className="bg-white cursor-pointer text-black px-4 py-2 rounded-full hover:bg-[#ffffffd0] hidden lg:block"
          onClick={() => navigate("/customize")}
        >
          Customize your Assistant
        </button>
      </div>

      <div className="flex flex-col items-center justify-center  gap-4">
        <div className={"max-w-[260px] h-[400px] rounded-xl "}>
          <img
            className="max-w-full h-full object-cover rounded-xl "
            src={userData?.user.assistantImage}
            alt="Assistant Image"
          />
        </div>
        <h1 className="text-white font-bold text-2xl text-center">
          {`I'm ${userData?.user.assistantName}`}
        </h1>
        <div>
          {!aiText && <img className="w-[200px]" src={user} alt="" />}
          {aiText && <img className="w-[200px]" src={ai} alt="" />}
        </div>
        <h3 className="text-white">{userText ? userText : aiText}</h3>
      </div>
    </div>
  );
};

export default Home;
