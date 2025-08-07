// ViewReferralPartner.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewReferralPartner.css'; // ✅ Import external CSS

const ViewReferralPartner = () => {
  const [partners, setPartners] = useState([]);
  const [error, setError] = useState('');
   const BASE_URL = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem('jwt');
       const res = await axios.get(`${BASE_URL}/api/admin/referral-partners`, {
  headers: { Authorization: `Bearer ${token}` }
});
        setPartners(res.data.partners);
      } catch (err) {
        console.error('Error fetching referral partners:', err);
        setError('Failed to load referral partners.');
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className="referral-container">
      <h2 className="referral-title">Referral Partners</h2>

      {error && <p className="referral-error">{error}</p>}

      {partners.length === 0 ? (
        <p className="referral-message">No referral partners found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="referral-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Contact Number</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner, index) => (
                <tr key={partner._id}>
                  <td>{index + 1}</td>
                  <td>{partner.name}</td>
                  <td>{partner.contactNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewReferralPartner;
