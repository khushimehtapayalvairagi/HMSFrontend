import React, { useState } from 'react';
import axios from 'axios';

const AddLabour = () => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(true); // 🔄 toggle state
const BASE_URL = process.env.REACT_APP_BASE_URL;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");

      const res = await axios.post(
        `${BASE_URL}/api/admin/labour-rooms`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      setMessage(res.data.message);
      setForm({ name: '', description: '' });
      setShowForm(false); // ⛔ hide form on success
    } catch (error) {
      console.error("Creation failed:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleAddAnother = () => {
    setMessage('');
    setShowForm(true);
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Add Labour Room</h2>

      {showForm ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter room name"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Description:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Enter room description"
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Create Labour Room
          </button>
        </form>
      ) : (
        <>
          <p style={{
            marginTop: '20px',
            textAlign: 'center',
            color: message.toLowerCase().includes('success') ? 'green' : 'red',
            fontWeight: 'bold'
          }}>
            {message}
          </p>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={handleAddAnother} style={{
              padding: '10px 20px',
              backgroundColor: '#2ecc71',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              cursor: 'pointer'
            }}>
              + Add Another
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddLabour;
