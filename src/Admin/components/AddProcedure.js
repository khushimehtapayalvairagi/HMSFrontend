import React, { useState } from 'react';
import axios from 'axios';

const Procedure = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    cost: ''
  });

  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showForm, setShowForm] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' }); // clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setFieldErrors({}); // reset field errors

    try {
      const token = localStorage.getItem('jwt');

      const response = await axios.post(
        'http://localhost:8000/api/admin/procedures',
        {
          name: form.name,
          description: form.description,
          cost: Number(form.cost)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          validateStatus: false // manually check status
        }
      );

      if (response.status === 201) {
        setMessage(response.data.message);
        setForm({ name: '', description: '', cost: '' });
        setShowForm(false);
      } else {
        // If procedure already exists, show error under name field
        if (response.data.message?.toLowerCase().includes('already exists')) {
          setFieldErrors({ name: response.data.message });
        } else {
          setMessage(response.data.message || 'Failed to create procedure.');
        }
      }

    } catch (error) {
      console.error('Procedure creation failed:', error);
      setMessage('Something went wrong.');
    }
  };

  const toggleForm = () => {
    setShowForm(true);
    setMessage('');
    setFieldErrors({});
  };

  return (
    <div style={{
      maxWidth: '600px', margin: '40px auto', backgroundColor: '#fff',
      padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Procedure</h2>

      {!showForm ? (
        <>
          {message && (
            <p style={{
              textAlign: 'center',
              color: message.toLowerCase().includes('success') ? 'green' : 'red',
              fontWeight: 'bold'
            }}>
              {message}
            </p>
          )}

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button onClick={toggleForm} style={{
              padding: '10px 20px', backgroundColor: '#3498db',
              color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer'
            }}>
              + Add Another
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: '15px' }}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: '90%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            {fieldErrors.name && (
              <div style={{ color: 'red', marginTop: '5px' }}>{fieldErrors.name}</div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '15px' }}>
            <label>Description:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="3"
              style={{ width: '90%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>

          {/* Cost */}
          <div style={{ marginBottom: '15px' }}>
            <label>Cost:</label>
            <input
              type="number"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              required
              style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>

          <button type="submit" style={{
            width: '100%', padding: '12px',
            backgroundColor: '#2ecc71', color: '#fff',
            border: 'none', borderRadius: '6px', cursor: 'pointer'
          }}>
            Create Procedure
          </button>
        </form>
      )}
    </div>
  );
};

export default Procedure;
