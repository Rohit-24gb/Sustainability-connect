import React from 'react'
import MarqueeWithImages from '../components/MarqueeImage/MarqueeWithImages';
import Slideshow from '../components/Slider/Slideshow';
import MainSection from '../components/MainSection/MainSection';
import OurServices from '../components/OurServices/OurServices';
import FaqSection from '../components/FaqSection/FaqSection';
import ContactMainPage from '../components/ContactMainPage.js/ContactMainPage'
import Footer from '../components/Footer/Footer';
// import TestimonialCard from '../components/Testimonal/Testimonal';


const Homepage = () => {
    const texts = [
        'Green Living',
        'Sustainable Choices',
        'Eco-friendly Products',
        'Reduce, Reuse, Recycle',
        'Community Engagement',
        'Zero Waste Solutions',
        'Sustainable Lifestyle',
        'Green Living',
        'Sustainable Choices',
        'Eco-friendly Products',
        'Reduce, Reuse, Recycle',
        'Community Engagement',
        'Zero Waste Solutions',
        'Sustainable Lifestyle',
      ];
    return (
        <>
            <Slideshow/>
            <MarqueeWithImages texts={texts} delay={1000} />
            <MainSection/>
            <OurServices/>
            <FaqSection/>
            <ContactMainPage/>
            {/* <TestimonialCard/> */}
            <Footer/>
        </>
    )
}

export default Homepage
