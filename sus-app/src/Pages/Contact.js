import React from 'react'
import Footer from '../components/Footer/Footer'
import BackgroundImageWithCaptions from '../components/BackgroundImageWithCaptions/BackgroundImageWithCaptions'
import backgroundImage from '../assets/bacgroundcontact.png';
import ContactInfo from '../components/ContactInfo/ContactInfo';
import ContactForm from '../components/ContactForm/ContactFrom';

const Contact = () => {
  return (
    <>
    <BackgroundImageWithCaptions
        imageSrc={backgroundImage}
      />
    <ContactInfo/>
    <ContactForm/>
    <Footer/>
    </>
  )
}

export default Contact
