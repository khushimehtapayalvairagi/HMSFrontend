import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VisitWard.css'; // Import external CSS

const VisitWard = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await axios.get('http://localhost:8000/api/admin/wards', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWards(res.data.wards || []);
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
  }, []);

  return (
    <div className="ward-container">
      <h2 className="ward-title">Ward List</h2>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table className="ward-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Room Category</th>
                <th>Beds</th>
              </tr>
            </thead>
            <tbody>
              {wards.map((ward) => (
                <tr key={ward._id}>
                  <td>{ward.name}</td>
                  <td>{ward.roomCategory?.name || 'N/A'}</td>
                  <td>
                    <ul>
                      {ward.beds.map((bed, index) => (
                        <li key={index}>
                          Bed {bed.bedNumber} - {bed.status}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VisitWard;
