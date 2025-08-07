import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewProcedure.css'; // External CSS

const ViewProcedure = () => {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
   const BASE_URL = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get(`${BASE_URL}/api/admin/procedures`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProcedures(response.data.procedures || []);
      } catch (err) {
        setError('Failed to load procedures');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, []);

  return (
    <div className="procedure-container">
      <h2 className="procedure-title">Procedure List</h2>

      {loading ? (
        <p className="status-message">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : procedures.length === 0 ? (
        <p className="status-message">No procedures found.</p>
      ) : (
        <div className="procedure-grid">
          {procedures.map((procedure) => (
            <div key={procedure._id} className="procedure-card">
              <h3 className="procedure-card-title">{procedure.name}</h3>
              <p><strong>Description:</strong> {procedure.description}</p>
              <p><strong>Cost:</strong> ₹{procedure.cost}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewProcedure;
