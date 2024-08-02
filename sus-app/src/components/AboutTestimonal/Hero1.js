import React from 'react'
import leaf2 from '../../assets/leaf2.png'
import avtar from '../../assets/avatar.png'
import rating from '../../assets/rating.png'
import './Hero1.css'

const Hero1 = () => {
   return (
      <div className='Container'>
         <div className='Text'>
            <span><img src={leaf2} alt='img' />
            </span><p>    TESTIMONIALS</p>

         </div>
         <div className='text'>
            <p1>Best Feedback About</p1>
            <p1>Sustainability Connect</p1>
         </div>
         <div className='main'>

            <div className='left'>

               <div className='img3'>
                  <span>
                     <img src={avtar} alt='img'></img>
                  </span>
               </div>

               <div className='img4'>
                  <span><img src={rating} alt='img' />

                  </span>
                  <span><img src={rating} alt='img' />

                  </span>
                  <span><img src={rating} alt='img' />

                  </span>
                  <span><img src={rating} alt='img' />

                  </span>
                  <span><img src={rating} alt='img' />

                  </span>
               </div>

               <p className='p1'>Sustainability Connect has completely transformed</p>
               <p className='p1'>the way I approach recycling and sustainable living.</p>
               <p className='p1'>The Recycling Centre Locator is incredibly user-</p>
               <p className='p1'>friendly, and I've discovered so many local centers</p>
               <p className='p1'>I didn't know existed!</p>
               <p className='p1'>Jane D. Customer.</p>
               <p className='p1'> Customer.</p>



            </div>

         </div>

      </div >
   )
}

export default Hero1
