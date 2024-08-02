import React from 'react';
import location from "../../assets/map_pin.png";
import phonecall from "../../assets/phone.png";
import maillogo from "../../assets/mail.png";
import './ContactInfo.css';

function ContactInfo() {
    return (
        <div className="contact-info-banner">
            <div className="contact-way">
                <div className="contact-banner-img">
                    <img src={location} alt="Location icon" />
                </div>
                <h1 className='first-header'>Address</h1>
                <p className='sec-header'>Bhopal, M.P</p>
            </div>

            <div className="contact-way">
                <div className="contact-banner-img">
                    <img src={phonecall} alt="Phone icon" />
                </div>
                <h1 className='first-header'>Make A Call</h1>
                <p className='sec-header'>+91 999-999-9999 <br />+91 777-777-7777</p>
            </div>

            <div className="contact-way">
                <div className="contact-banner-img">
                    <img src={maillogo} alt="Mail icon" />
                </div>
                <h1 className='first-header'>24/7 Support</h1>
                <p className='sec-header'>example@gmail.com <br />info@gmail.com</p>
            </div>
        </div>
    );
}

export default ContactInfo;







