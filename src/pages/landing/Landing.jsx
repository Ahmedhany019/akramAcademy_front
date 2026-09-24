import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Features from "./components/Features";
import PricingOffers from "./components/PricingOffers";
import FAQ from "./components/FAQ";

const Landing = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <PricingOffers />
      <About />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Landing;
