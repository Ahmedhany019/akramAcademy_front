import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Phone,
  Facebook,
  Youtube,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "من أنا", path: "/about" },
    { name: "الكورسات", path: "/courses" },
    { name: "المواد", path: "/subjects" },
    { name: "الشهادات", path: "/certificates" },
    { name: "التواصل", path: "/contact" },
  ];

  return (
    <header
      dir="rtl"
      className="fixed z-[999] top-0  w-full bg-[#0f1d41] text-white shadow-lg"
    >
      <div className="mx-auto flex h-[90px] max-w-[1250px] items-center justify-between px-5">

        {/* Logo */}
        <NavLink to="/" className="shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <span className="absolute -top-1 text-2xl text-[#f1c40f]">
                ♛
              </span>

              <span
                className="font-serif text-5xl italic text-white"
                style={{ fontFamily: "Georgia, serif" }}
              >
                A
              </span>
            </div>

            <div className="hidden sm:block text-left">
              <h1 className="text-lg font-semibold leading-tight">
                Monsieur
              </h1>

              <h2 className="text-xl font-bold leading-tight">
                Akram Ibrahim
              </h2>

              <p className="text-sm text-[#587aa9]">
                Professeur de français
              </p>
            </div>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group relative py-3 text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-[#f1c40f]"
                    : "text-white hover:text-[#f1c40f]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}

                  <span
                    className={`absolute -bottom-1 right-0 h-[2px] bg-[#f1c40f] transition-all duration-300 ${
                      isActive
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">

          <Link
            to="/register"
            className="flex items-center gap-2 rounded-full bg-[#f1c40f] px-6 py-3 text-sm font-bold text-[#0f1d41] transition-all duration-300 hover:scale-105 hover:bg-[#dcb20c]"
          >
            سجل دخول
            <ArrowRight size={17} />
          </Link>

          {/* Social Icons */}
          <a
            href="https://www.youtube.com/@m-akramibrahime9734"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#587aa9] text-white transition hover:border-[#f1c40f] hover:text-[#f1c40f]"
          >
            <Youtube size={18} />
          </a>

          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#587aa9] text-white transition hover:border-[#f1c40f] hover:text-[#f1c40f]"
          >
            <Facebook size={18} />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex lg:hidden h-11 w-11 items-center justify-center rounded-lg border border-[#587aa9] text-white"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-[#587aa9]/30 bg-[#0f1d41] transition-all duration-300 lg:hidden ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-5 py-4">

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `border-b border-[#587aa9]/20 py-4 text-sm ${
                  isActive
                    ? "font-bold text-[#f1c40f]"
                    : "text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/register"
            className="w-fit mx-auto flex mt-4 items-center gap-2 rounded-full bg-[#f1c40f] px-6 py-3 text-sm font-bold text-[#0f1d41] transition-all duration-300 hover:scale-105 hover:bg-[#dcb20c]"
          >
            سجل دخول
            <ArrowRight size={17} />
          </Link>

          <div className="mt-5 flex justify-center gap-3 pb-3">
            <a
              href="https://www.youtube.com/@m-akramibrahime9734"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#587aa9]"
            >
              <Youtube size={18} />
            </a>

            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#587aa9]"
            >
              <Facebook size={18} />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;