import { React, useState } from "react";
import logo from "../img/iw design.png";

export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
];

const Header = () => {
  const [active, setActive] = useState("Home");

  return (
    <nav className="header w-full flex py-4 pl-5 justify-between items-center navbar">
      {/* Logo */}
      <img src={logo} alt="logo" width={100}/>
      
      {/* Desktop Navigation */}
      <ul className="list-none sm:flex hidden pl-10 justify-start items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-bold cursor-pointer text-[16px] ${
              active === nav.title ? "text-white" : "text-dimWhite"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;