import { Link, NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useContext, useState } from 'react';

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <h>SaiFashionZone by Raiba</h>
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
       
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => {
            setShowSearch(true);
          }}
          src={assets.search_icon}
          alt=""
          className="w-5 cursor-pointer "
        />
        <div className="group relative">
          <Link to="/login">
            <img
              src={assets.profile_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          </Link>
          
          </div>
        </div>

        <Link to="/cart" className="relative ">
          <img src={assets.cart_icon} alt="" className="w-5 min-w-5 " />
         
        </Link>

        <img
          src={assets.menu_icon}
          alt=""
          className="w-5 cursor-pointer sm:hidden "
          onClick={() => setVisible(!visible)} //visibility toggle (true/false))
        />
      

      {/* Sidebar menu for small screens */}
      <div
         className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white ease-in duration-300
              ${visible ? 'w-full' : 'w-0'}`}
          >
         <div className="flex flex-col text-gray-600 ">
          <div
            onClick={() => {
              setVisible(false);
            }}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} alt="" className="h-4 rotate-180" />
            <p className="font-semibold">Back</p>
          </div>

          <NavLink
            onClick={() => {
              setVisible(false);
            }}
            className="py-2 pl-6 border"
            to="/"
          >
            {' '}
            HOME{' '}
          </NavLink>
          <NavLink
            onClick={() => {
              setVisible(false);
            }}
            className="py-2 pl-6 border"
            to="/collection"
          >
            {' '}
            COLLECTION{' '}
          </NavLink>
          <NavLink
            onClick={() => {
              setVisible(false);
            }}
            className="py-2 pl-6 border"
            to="/about"
          >
            {' '}
            ABOUT{' '}
          </NavLink>
          <NavLink
            onClick={() => {
              setVisible(false);
            }}
            className="py-2 pl-6 border"
            to="/contact"
          >
            {' '}
            CONTACT{' '}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
