import React from "react";
import { NavLink } from "react-router-dom";
import { Facebook, Youtube, MessageCircle } from "lucide-react";

const Footer = () => {
  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "من أنا", path: "/about" },
    { name: "الكورسات", path: "/courses" },
    { name: "المواد", path: "/subjects" },
    { name: "الشهادات", path: "/certificates" },
    { name: "التواصل", path: "/contact" },
  ];

  return (
    <footer
      dir="rtl"
      className="relative overflow-hidden bg-[#0f1d41] text-white border-t border-[#587aa9]/40 py-8"
    >
      <div className="mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 px-6 max-w-[1250px]">

        {/* Logo */}
        <NavLink to="/" className="flex shrink-0 items-center gap-3">
          <div className="relative flex h-[65px] w-[50px] items-center justify-center">
            <span className="absolute -top-1 text-[20px] text-[#f1c40f]">
              ♛
            </span>
            <span
              className="text-[48px] italic leading-none text-white"
              style={{ fontFamily: "Georgia, serif" }}
            >
              A
            </span>
          </div>

          <div className="text-right">
            <h3 className="text-[14px] font-semibold leading-tight">
              Monsieur
            </h3>
            <h2 className="text-[16px] font-bold leading-tight">
              Akram Ibrahim
            </h2>
            <p className="mt-0.5 text-[10px] text-[#9fb4d1]">
              Professeur de français
            </p>
          </div>
        </NavLink>

        {/* Center */}
        <div className="flex flex-col items-center text-center">
          {/* Navigation */}
          <nav className="flex flex-wrap justify-center items-center gap-3 sm:gap-5">
            {navLinks.map((link, index) => (
              <React.Fragment key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-xs font-medium transition-colors duration-300 ${
                      isActive ? "text-[#f1c40f]" : "text-white hover:text-[#f1c40f]"
                    }`
                  }
                >
                  {link.name}
                </NavLink>

                {index !== navLinks.length - 1 && (
                  <span className="h-3 w-px bg-white/30 hidden sm:inline-block" />
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* French flag */}
          <div className="mt-3 flex items-center">
            <span className="h-[3px] w-6 rounded-l-full bg-[#1a45c4]" />
            <span className="h-[3px] w-6 bg-white" />
            <span className="h-[3px] w-6 rounded-r-full bg-[#ec2938]" />
          </div>

          {/* Slogan */}
          <div className="mt-2 flex items-center gap-3">
            <span className="h-px w-6 bg-white/50" />
            <p className="text-xs italic text-white/90">
              Ensemble, apprenons le français
            </p>
            <span className="h-px w-6 bg-white/50" />
          </div>
        </div>

        {/* Social + Copyright */}
        <div className="flex shrink-0 flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#587aa9] text-white transition-all duration-300 hover:border-[#f1c40f] hover:text-[#f1c40f]"
            >
              <Youtube size={17} />
            </a>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#587aa9] text-white transition-all duration-300 hover:border-[#f1c40f] hover:text-[#f1c40f]"
            >
              <Facebook size={17} />
            </a>
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#587aa9] text-white transition-all duration-300 hover:border-[#f1c40f] hover:text-[#f1c40f]"
            >
              <MessageCircle size={17} />
            </a>
          </div>

          <p className="text-center text-[10px] leading-4 text-white/60">
            © {new Date().getFullYear()} Monsieur Akram Ibrahim
            <br />
            Tous droits réservés
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;