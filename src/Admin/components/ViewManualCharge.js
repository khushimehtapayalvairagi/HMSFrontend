import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewManualCharge = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.get('http://localhost:8000/api/admin/manual-charge-items', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems(res.data.items);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch items');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manual Charge Items</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : items.length === 0 ? (
        <p>No manual charge items found.</p>
      ) : (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px'
        }}>
          <thead>
            <tr>
              <th style={thStyle}>Item Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price (₹)</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td style={tdStyle}>{item.itemName}</td>
                <td style={tdStyle}>{item.category}</td>
                <td style={tdStyle}>{item.defaultPrice}</td>
                <td style={tdStyle}>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  border: '1px solid black',
  padding: '10px',
  backgroundColor: '#f8f8f8',
  textAlign: 'left'
};

const tdStyle = {
  border: '1px solid black',
  padding: '10px',
   backgroundColor: '#f8f8f8',
};

export default ViewManualCharge;
