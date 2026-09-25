import React from "react";
import { hero, teacher, lefrance } from "../../../assets/images";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <main
      id="home"
      style={{ backgroundImage: `url(${hero})` }}
      className="w-full bg-no-repeat bg-right h-[80vh] mt-[89px] relative flex flex-col items-center justify-center z-[99]"
    >
        <div className="absolute inset-0 z-[-999] bg-black/30" />
        <div className="lg:w-[40%] sm:w-[60%] w-[100] absolute z-[-999]  bottom-0">
          <img
            src={teacher}
            alt="Monsieur Akram Ibrahim"
            className="inset-0 h-full w-full object-cover object-center"
          />
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-1 justify-between items-center w-full h-[50vh] relative">
          <div className="flex-1 flex justify-center items-center">
            
          </div>
          <div className="flex flex-col justify-center items-center flex-1 text-white absolute top-0 left-[6%]">
          <div>
              <h1 className="md:text-6xl text-4xl font-bold text-end">Monsieur<br/> Akram Ibrahim</h1>
              <span className="flex items-center  w-full">
                  <span className="w-full h-2 rounded-r-full bg-red-700"></span>
                  <span className="w-full h-2  bg-white"></span>
                  <span className="w-full h-2 rounded-l-full bg-[#1a45c4]"></span>
              </span>
              
          </div>
                  <img
                  src={lefrance}
                  alt="lefrance"
                  className="absolute bottom-[-100%] left-0 w-[300px] object-cover object-center"
                  />
            
            <p className="md:text-4xl text-2xl w-full text-end">Professeur de français</p>
          <Link
          to="/register"
          className="flex mr-auto w-fit items-center gap-2 rounded-full bg-[#1a45c4] px-6 py-3 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-[#20276d]"
          >
          سجل دخول
          <ArrowRight size={20} className="animate-bounce transition-all duration-500"/>
        </Link>
          </div>
          
        </div>

        
        </div>
      
      {/* <Features /> */}
    </main>
  );
};

export default Hero;
