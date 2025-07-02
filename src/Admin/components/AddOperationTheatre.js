import React, { useState } from 'react';
import axios from 'axios';

const AddOperationTheatre = () => {
  const [form, setForm] = useState({ name: '', status: 'Available' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(true);

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
      const res = await axios.post('http://localhost:8000/api/admin/operation-theaters', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage(res.data.message);
      setForm({ name: '', status: 'Available' });
      setShowForm(false); // hide form after successful creation
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong';
      if (errorMsg.toLowerCase().includes('already exists')) {
        setErrors({ name: errorMsg }); // specific field error
      } else {
        setMessage(errorMsg);
      }
    }
  };

  const toggleForm = () => {
    setShowForm(prev => !prev);
    setErrors({});
    setMessage('');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>Add Operation Theater</h2>

      {!showForm ? (
        <>
          {message && (
            <p style={{ textAlign: 'center', color: 'green', fontWeight: 'bold' }}>{message}</p>
          )}
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button onClick={toggleForm} style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              + Add Another
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Name</label><br />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Operation Theater Name"
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            {errors.name && <div style={{ color: 'red', marginTop: '5px' }}>{errors.name}</div>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Status</label><br />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Submit
          </button>

          {message && <p style={{ marginTop: '20px', textAlign: 'center', color: 'green' }}>{message}</p>}
        </form>
      )}
    </div>
  );
};

export default AddOperationTheatre;
