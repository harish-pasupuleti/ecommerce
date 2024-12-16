import React from "react";

const Navbar = ({ setToken }) => {
  const handleLogout = () => {
    const handleLogout = () => {
      sessionStorage.removeItem('user');
      setUser(null);
      navigate('/login');  // Redirect to login page after logout
    };
  };

  return (
    <div className="flex items-center justify-between py-2 px-[4%]">
      <h>SaiFashionZone by Raiba</h>
      <button
        onClick={handleLogout} // Handle the logout action on button click
        className="bg-gray-600 text-white px-5 py-2 sm:py-2 rounded-md text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
