import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, useNavigate } from "react-router-dom";
import Add from "./pages/Add";

import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  const [user, setUser] = useState(
    sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <>
          <Navbar setUser={setUser} handleLogout={handleLogout} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Add />} />
                <Route path="/add" element={<Add />} />
               
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
