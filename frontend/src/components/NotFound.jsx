import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center">
      <div>
        <h1 className="text-5xl font-bold text-red-600">404</h1>
        <p className="text-xl mt-4">Page Not Found</p>
        <a href="/" className="text-blue-500 mt-2 inline-block">
          Go back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
