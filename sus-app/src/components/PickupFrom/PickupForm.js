import React, { useState, useEffect } from 'react';
import recyclableItems from '../../data/recycleitems';
import './PickupForm.css';
import PickupImage from '../../assets/project2.jpg';
import { NotificationManager } from 'react-notifications';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const PickupForm = () => {
  const [centers, setCenters] = useState([]);
  const [center, setCenter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    center: '',
    pincode: '',
    contact: '',
    wasteType: '',
    date: ''
  });

  useEffect(() => {
    // Fetch recycling centers from API
    fetch('https://sustainability-connect-backend.onrender.com/api/recycling-centers')
      .then(response => response.json())
      .then(data => setCenters(data))
      .catch(error => console.error('Error fetching recycling centers:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('https://sustainability-connect-front-end.onrender.com/api/schedule-pickup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        NotificationManager.success('Pickup booked successfully!');
        setFormData({
          name: '',
          email: '',
          address: '',
          center: '',
          pincode: '',
          contact: '',
          wasteType: '',
          date: ''
        });
      } else {
        NotificationManager.error('Failed to book pickup.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      NotificationManager.error('Error booking pickup.');
    });
  };

  return (
    <div className="section pickup-container">
      <h2>Schedule Waste Pickup</h2>
      <div className="pickup-content">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Your Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <select
            name="center"
            value={formData.center}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Recycling Center</option>
            {centers.length > 0 ? (
              centers.map(center => (
                <option key={center._id} value={center.name}>{center.name}</option>
              ))
            ) : (
              <option value="" disabled>No centers available</option>
            )}
          </select>
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
          />
          <select
            name="wasteType"
            value={formData.wasteType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Type of Waste</option>
            {recyclableItems.map(item => (
              <option key={item.id} value={item.name}>{item.name}</option>
            ))}
          </select>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <button type="submit">Schedule Pickup</button>
        </form>
        <div className="pickup-image">
          <img src={PickupImage} alt="Pickup" />
        </div>
      </div>
    </div>
  );
};

export default PickupForm;







// import React, { useState, useEffect } from 'react';
// import recyclableItems from '../../data/recycleitems';
// import './PickupForm.css';
// import PickupImage from '../../assets/project2.jpg';
// import { NotificationManager } from 'react-notifications';
// import { NotificationContainer } from 'react-notifications';
// import 'react-notifications/lib/notifications.css';

// const PickupForm = () => {
//   const [centers, setCenters] = useState([]);
//   const [center, setCenter] = useState('');
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     address: '',
//     center: '',
//     pincode: '',
//     contact: '',
//     wasteType: '',
//     date: ''
//   });

//   useEffect(() => {
//     // Fetch recycling centers from API
//     fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recycling-centers`)
//       .then(response => response.json())
//       .then(data => setCenters(data))
//       .catch(error => console.error('Error fetching recycling centers:', error));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     fetch('/api/schedule-pickup', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(formData)
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.success) {
//         NotificationManager.success('Pickup booked successfully!');
//         setFormData({
//           name: '',
//           email: '',
//           address: '',
//           center: '',
//           pincode: '',
//           contact: '',
//           wasteType: '',
//           date: ''
//         });
//       } else {
//         NotificationManager.error('Failed to book pickup.');
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       NotificationManager.error('Error booking pickup.');
//     });
//   };

//   return (
//     <div className="section pickup-container">
//       <h2>Schedule Waste Pickup</h2>
//       <div className="pickup-content">
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="name"
//             placeholder="Your Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Your Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="address"
//             placeholder="Your Address"
//             value={formData.address}
//             onChange={handleChange}
//             required
//           />
//           <select
//             name="center"
//             value={formData.center}
//             onChange={handleChange}
//             required
//           >
//             <option value="" disabled>Select Recycling Center</option>
//             {centers.length > 0 ? (
//               centers.map(center => (
//                 <option key={center._id} value={center.name}>{center.name}</option>
//               ))
//             ) : (
//               <option value="" disabled>No centers available</option>
//             )}
//           </select>
//           <input
//             type="text"
//             name="pincode"
//             placeholder="Pincode"
//             value={formData.pincode}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="contact"
//             placeholder="Contact Number"
//             value={formData.contact}
//             onChange={handleChange}
//             required
//           />
//           <select
//             name="wasteType"
//             value={formData.wasteType}
//             onChange={handleChange}
//             required
//           >
//             <option value="" disabled>Select Type of Waste</option>
//             {recyclableItems.map(item => (
//               <option key={item.id} value={item.name}>{item.name}</option>
//             ))}
//           </select>
//           <input
//             type="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             required
//           />
//           <button type="submit">Schedule Pickup</button>
//         </form>
//         <div className="pickup-image">
//           <img src={PickupImage} alt="Pickup" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PickupForm;


