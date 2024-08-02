import React from "react";
import leaf from "../../assets/small_leaf.png"
import './ContactForm.css'

function ContactForm(){
    return(
        <>
            <div className="contact-us-bg">
                <div className="map">
                    {/* <h1>Goofle map</h1> */}
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.691029278931!2d77.29907037437277!3d23.181474210381488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c5c3c7b0aa7e1%3A0xf4798e9656dfb029!2sSagar%20Institute%20of%20Science%2C%20Technology%20%26%20Research%2C%20Ratibad!5e0!3m2!1sen!2sin!4v1721761726380!5m2!1sen!2sin"
                 width="100%" height="450" 
                 style={{border:0}}
                 allowFullScreen="" 
                 loading="lazy" 
                 referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
                
 <div className="contact-from">
                    <form action="https://formspree.io/f/xwpevqyb" method="post">
                    <p><img src={leaf} alt="" srcset="" />Get In Touch</p>  
                    <h2>Wrting us Something</h2>
                    <div className="input-text">
                        <input type="text" name="username" id="username" placeholder="Your Name"  autoComplete="off" required/>
                        <input type="text" name="subject" id="subject" placeholder="Subject"  autoComplete="off" required/>
                    </div>

                    <div className="input-text">
                        <input type="text" name="email" id="email" placeholder="Your Email"  autoComplete="off" required/>
                        <input type="number" name="phoneno" id="phoneno" placeholder="Phone No" autoComplete="off" required/>
                    </div>
                        
                        <textarea name="message" id="message" cols="30" rows="6" autoCapitalize="off"  required placeholder="Message"></textarea>
                        <button type="submit" className="button">Send Message</button>
                    </form>
                </div>

            </div>
        </>
    )
}
export default ContactForm 