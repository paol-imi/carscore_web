import React, { useState } from "react";
import { faqItems } from "../../data/text";
import HeroSection from "../../components/HeroSection/";
import ApiIntegrationSection from "../../components/ApiIntegrationSection/";
import About from "../../components/About";
import FAQ from "../../components/FAQ/";
import Team from "../../components/Team/";
import Premium from "../../components/Premium";
function Root() {
  return (
    <div className="relative min-h-screen bg-main-gradient z-10 overflow-x-hidden">
      <HeroSection />
      <About />
      <Premium />
      <ApiIntegrationSection />
      <FAQ faqItems={faqItems} />
      <Team />
    </div>
  );
}

export default Root;
