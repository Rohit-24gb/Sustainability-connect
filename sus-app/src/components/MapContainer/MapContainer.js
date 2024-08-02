import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MapContainer.css';

const MapContainer = () => {
  const [recyclingCenters, setRecyclingCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  // Fetch data from the backend API
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recycling-centers`)
      .then(response => response.json())
      .then(data => setRecyclingCenters(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Filter centers based on the search term
  const filteredCenters = recyclingCenters.filter(center =>
    Object.keys(center).some(key =>
      String(center[key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Toggle show more or less
  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  // Navigate to the recycling center detail page
  const handleCenterClick = (id) => {
    navigate(`/recycling-center/${id}`);
  };

  return (
    <div className="section map-container">
      <h2>Find Recycling Center</h2>
      <input
        type="text"
        placeholder="Search centers"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', maxWidth: '400px', marginBottom: '1rem' }}
      />
      <div className="recycling-centers">
        {filteredCenters.slice(0, showAll ? filteredCenters.length : 6).map(center => (
          <div
            key={center._id}
            className="center-card"
            onClick={() => handleCenterClick(center.centreID)}
          >
            {center.imageUrl && <img src={center.imageUrl} alt={center.name} className="center-image" />}
            <h3>{center.name}</h3>
            <p>{center.address}</p>
            <p>{center.city}, {center.dist}, {center.state}, {center.country}</p>
            <p>Pincode: {center.pincode}</p>
            {center.phone_no && <p>Phone: {center.phone_no}</p>}
            {center.email && <p>Email: <a href={`mailto:${center.email}`}>{center.email}</a></p>}
            {center.website && <p>Website: <a href={center.website} target="_blank" rel="noopener noreferrer">{center.website}</a></p>}
          </div>
        ))}
      </div>
      {filteredCenters.length > 6 && (
        <button onClick={handleShowMore} className="show-more-btn">
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export default MapContainer;

