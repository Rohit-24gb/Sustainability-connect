import React, { useState } from 'react';
import './FaqSection.css'

const FAQ = () => {
  const [visibleFAQ, setVisibleFAQ] = useState(null);

  const faqs = [
    {
      question: "What services does Sustainability Connect offer?",
      answer: "Sustainability Connect offers a range of services including a Recycling Centre Locator, Sustainable Product Finder, Environmental Impact Assessment, Community Engagement and Education, and Customized Sustainability Solutions."
    },
    {
      question: "How can I find local recycling centers using your platform?",
      answer: "You can use our Recycling Centre Locator to easily find nearby recycling facilities by entering your location. Our tool provides detailed information on the types of materials accepted and operating hours."
    },
    {
      question: "What makes a product sustainable and how do I find them?",
      answer: "A product is considered sustainable if it is made from eco-friendly materials, produced ethically, and has a minimal impact on the environment. Our Sustainable Product Finder helps you discover a wide range of such products, ensuring you make environmentally responsible choices."
    }
  ];

  const toggleFAQ = (index) => {
    setVisibleFAQ(visibleFAQ === index ? null : index);
  };

  return (
    <> 
    <div className="faq-section">

    <div className="bg-style">
      <p>. . . . . . <br /> . . . . . . <br />. . . . . . </p>
    </div>
    
    <div className='faq-qus'>
      
      <h1>FAQ</h1>
      <ul>
        {faqs.map((faq, index) => (
          <li key={index}>
            <button onClick={() => toggleFAQ(index)} className='faqUestionButton'>
              <p className='faqQuestionSection'>
              {faq.question}  
             
              </p> <hr className='inline'/> 
            </button>
            {visibleFAQ === index && <p className='faqans' >{faq.answer}</p>} 
          </li>
        ))}
      </ul>
      
    </div>
    <div className="bg-style1">
      <p style={{float:"right"}}>. . . . . . <br /> . . . . . . <br />. . . . . . </p>
    </div>
    </div>
    </>
  );
};

export default FAQ;
