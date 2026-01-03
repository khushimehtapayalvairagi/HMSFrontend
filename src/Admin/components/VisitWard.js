import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VisitWard.css';

const VisitWard = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await axios.get(`${BASE_URL}/api/admin/wards`, {
          headers: { Authorization: `Bearer ${token}` },
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
                  <td>{ward.roomCategory?.name || "N/A"}</td>
                  <td>
                    <ul className="bed-list">
                      {ward.beds
                        .sort((a, b) => a.bedNumber - b.bedNumber)
                        .map((bed) => (
                          <li key={bed.bedNumber}>
                            Bed {bed.bedNumber} —{" "}
                            <span className={`status ${bed.status}`}>
                              {bed.status}
                            </span>
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
