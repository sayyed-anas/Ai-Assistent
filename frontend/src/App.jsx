import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Toaster } from "react-hot-toast";
import { userDataContext } from "./context/UserContext";
import { useContext } from "react";
import Home from "./pages/Home";
import Customize from "./pages/Customize";
import NotFound from "./components/NotFound";
import Customize2 from "./pages/Customize2";
import spinner from "./assets/spinner.gif";

function App() {
  const { userData, loading } = useContext(userDataContext);

  if (loading)
    return (
      <div className="w-[100vw] h-[100vh] bg-[black] flex items-center justify-center">
        <img src={spinner} alt="Spinner" />
      </div>
    );

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={
            userData?.user.assistantImage && userData?.user.assistantName ? (
              <Home />
            ) : (
              <Navigate to={"/customize"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to={"/"} />}
        />
        <Route
          path="/customize"
          element={userData ? <Customize /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/customize2"
          element={userData ? <Customize2 /> : <Navigate to={"/signup"} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
