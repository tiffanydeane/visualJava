import { React, useState } from "react";
import logo from "../img/iw design.png";
import { Link } from 'react-router-dom';

const Header = () => {
  const [active, setActive] = useState();

  return (
    <nav className="header w-full flex py-4 pl-5 justify-between items-center navbar">
      <Link to="/"><img src={logo} alt="logo" width={100}/></Link>
      
      <ul className="list-none sm:flex hidden pl-10 justify-start items-center flex-1">
          <li
            key={"home"}
            className={`font-bold cursor-pointer text-[16px] mr-0 ${
              active === "Home" ? "text-white" : "text-gray-200"
            }`}
            onClick={() => setActive("Home")}
          >
            <Link to="/">Home</Link>
          </li>
          <li
            key={"about"}
            className={`font-bold cursor-pointer text-[16px] ml-10 ${
              active === "About" ? "text-white" : "text-gray-200"
            }`}
            onClick={() => setActive("About")}
          >
            <Link to="/about">About</Link>
          </li>
      </ul>
    </nav>
  );
};

export default Header;