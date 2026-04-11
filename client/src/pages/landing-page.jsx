// src/pages/landing-page.jsx
import React from 'react';
import HeroSection from '../components/landing/hero-section';
import { FeaturesSection } from '../components/landing/features-section';
import Footer from '../components/layout/footer';
import Navbar from '../components/layout/navbar';

const LandingPage = () => {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      
      <div className="pt-16">
        <HeroSection />
      </div>
      
      {/* Adding a divider or space before features */}
      <div className="bg-black pt-20">
        <FeaturesSection />
      </div>

      <Footer />
    </main>
  );
};

export default LandingPage;




