import React from 'react';
import backgroundImage from '../assets/about-bg.jpg';
import BackgroundImageWithCaptions from '../components/BackgroundImageWithCaptions/BackgroundImageWithCaptions';
import MainSection from '../components/MainSection/MainSection'
import MarqueeWithImages from '../components/MarqueeImage/MarqueeWithImages';
import Footer from '../components/Footer/Footer';
import AboutTestimonal from '../components/AboutTestimonal/Hero1'
import Hero from '../components/AboutTestimonal001/Hero'
import ContactMainPage from '../components/ContactMainPage.js/ContactMainPage';

const About = () => {
  const texts = [
    'ULTIMATE  BATTLE  VICTORIOUS.',
    'ULTIMATE  BATTLE  VICTORIOUS.',
    'ULTIMATE  BATTLE  VICTORIOUS.',
    'ULTIMATE  BATTLE  VICTORIOUS.',

  ];
  return (
    <div className="about-container">
      
      <BackgroundImageWithCaptions
        imageSrc={backgroundImage}
        title="About Us"
      />
      <MainSection/>
      <Hero/>
      {/* <AboutContact/> */}
      <ContactMainPage/>
      <MarqueeWithImages texts={texts} delay={1000} />
      <AboutTestimonal/>
      <Footer/>
    </div>
  );
}

export default About;
