import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RecyclingCenterDetail.css';

const RecyclingCenterDetail = () => {
  const { centerID } = useParams();
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCenterDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/recycling-centers/${centerID}`);
        setCenter(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCenterDetails();
  }, [centerID]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!center) return <p>Recycling Center Not Found</p>;

  return (
    <div className="recycling-center-detail">
      <div className="detail-content">
        {/* <img src={center.imageUrl || 'default-image.jpg'} alt={center.name} className="recycling-center-image" /> */}
        <div className="details">
          <h1>{center.name}</h1>
          <p><strong>Address:</strong> {center.address}</p>
          <p><strong>City:</strong> {center.city}</p>
          <p><strong>State:</strong> {center.state}</p>
          <p><strong>Country:</strong> {center.country}</p>
          <p><strong>Pincode:</strong> {center.pincode}</p>
          <p><strong>Phone:</strong> {center.phone_no}</p>
          <p><strong>Email:</strong> <a href={`mailto:${center.email}`}>{center.email}</a></p>
          <p><strong>Website:</strong> <a href={center.website} target="_blank" rel="noopener noreferrer">{center.website}</a></p>
        </div>
      </div>
    </div>
  );
};

export default RecyclingCenterDetail;
