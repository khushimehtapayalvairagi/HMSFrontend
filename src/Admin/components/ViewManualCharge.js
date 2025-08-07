import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewManualCharge.css'; // Import the external CSS

const ViewManualCharge = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
   const BASE_URL = process.env.REACT_APP_BASE_URL;
  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.get(`${BASE_URL}/api/admin/manual-charge-items`, {
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
    <div className="manual-charge-container">
      <h2 className="manual-charge-title">Manual Charge Items</h2>

      {loading ? (
        <p className="status-message">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : items.length === 0 ? (
        <p className="status-message">No manual charge items found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="manual-charge-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td>{item.itemName}</td>
                  <td>{item.category}</td>
                  <td>{item.defaultPrice}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewManualCharge;
