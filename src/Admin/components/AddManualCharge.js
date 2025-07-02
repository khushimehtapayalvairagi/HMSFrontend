import React, { useState } from 'react';
import axios from 'axios';

const AddManualCharge = () => {
  const [form, setForm] = useState({
    itemName: '',
    category: '',
    defaultPrice: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(true); // Toggle state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.post('http://localhost:8000/api/admin/manual-charge-items', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage(res.data.message);
      setForm({ itemName: '', category: '', defaultPrice: '', description: '' });
      setShowForm(false); // Hide form on success
   } catch (err) {
  const backendErrors = err.response?.data?.errors || {};
  const fallback = err.response?.data?.message || 'Something went wrong';

  // 👇 If message says item name exists, map it to itemName field
  if (fallback.toLowerCase().includes('item') && fallback.toLowerCase().includes('exist')) {
    setErrors({ itemName: fallback });
  } else {
    setErrors(backendErrors);
    if (!Object.keys(backendErrors).length) setMessage(fallback);
  }
}
  }


  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Manual Charge Entry</h2>

        {/* Toggle button */}
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setMessage('');
              setErrors({});
            }}
            style={{
              marginBottom: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Add New Manual Charge
          </button>
        )}

        {showForm ? (
          <form onSubmit={handleSubmit}>
            {/* Item Name */}
            <div style={{ marginBottom: '15px' }}>
              <label>Item Name</label><br />
              <input
                type="text"
                name="itemName"
                value={form.itemName}
                onChange={handleChange}
                placeholder="e.g. X-ray, Blood Test, Admission Fee"
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              {errors.itemName && <div style={{ color: 'red', marginTop: '5px' }}>{errors.itemName}</div>}
            </div>

            {/* Category */}
            <div style={{ marginBottom: '15px' }}>
              <label>Category</label><br />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="">Select Category</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Lab">Lab</option>
                <option value="Labour Room">Labour Room</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <div style={{ color: 'red', marginTop: '5px' }}>{errors.category}</div>}
            </div>

            {/* Default Price */}
            <div style={{ marginBottom: '15px' }}>
              <label>Default Price (₹)</label><br />
              <input
                type="number"
                name="defaultPrice"
                value={form.defaultPrice}
                onChange={handleChange}
                placeholder="e.g. 500"
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              {errors.defaultPrice && <div style={{ color: 'red', marginTop: '5px' }}>{errors.defaultPrice}</div>}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '15px' }}>
              <label>Description</label><br />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. Charge for digital chest X-ray"
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              ></textarea>
              {errors.description && <div style={{ color: 'red', marginTop: '5px' }}>{errors.description}</div>}
            </div>

            <button type="submit" style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%'
            }}>Submit</button>
          </form>
        ) : (
          <p style={{ color: 'green', marginTop: '20px', textAlign: 'center' }}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default AddManualCharge;
