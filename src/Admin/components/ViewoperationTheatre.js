import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewOperationTheatre = () => {
  const [theaters, setTheaters] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await axios.get('http://localhost:8000/api/admin/operation-theaters', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTheaters(res.data.theaters);
      } catch (err) {
        setError('Failed to fetch operation theaters');
      }
    };

    fetchTheaters();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2 style={{ textAlign: 'center' }}>Operation Theaters</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {theaters.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No operation theaters found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {theaters.map((ot) => (
            <li key={ot._id} style={{
              padding: '15px',
              marginBottom: '10px',
              background: '#f1f1f1',
              borderRadius: '5px'
            }}>
              <strong>Name:</strong> {ot.name} <br />
              <strong>Status:</strong> {ot.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewOperationTheatre;
