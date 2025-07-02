import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewReferralPartner = () => {
  const [partners, setPartners] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await axios.get('http://localhost:8000/api/admin/referral-partners', {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Referral Partners</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {partners.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No referral partners found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>#</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner, index) => (
              <tr key={partner._id}>
                <td style={{ padding: '10px', border: '1px solid black',backgroundColor:'#f2f2f2' }}>{index + 1}</td>
                <td style={{ padding: '10px', border: '1px solid black',backgroundColor:'#f2f2f2'  }}>{partner.name}</td>
                <td style={{ padding: '10px', border: '1px solid black',backgroundColor:'#f2f2f2' }}>{partner.contactNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewReferralPartner;
