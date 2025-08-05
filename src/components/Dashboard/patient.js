import React, { useRef, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientForm = () => {
  const printRef = useRef();
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    relatives: [{ name: '', contactNumber: '', relationship: '' }]
  });
  const [submittedData, setSubmittedData] = useState(null);

  // Style objects
  const cardStyle = {
    backgroundColor: 'green',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '800px',
    margin: '2rem auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' /* like a card drop shadow */ ,
    fontFamily: 'Segoe UI, sans-serif'
  };
  const twoCol = { display: 'flex', gap: '1rem', marginBottom: '1rem' };
  const relRow = { display: 'flex', gap: '0.5rem', marginBottom: '0.8rem', alignItems: 'center' };

  const validateContact = (val) => /^\d*$/.test(val) && val.length <= 10;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contactNumber' && !validateContact(value)) {
      return toast.error('Contact number must be up to 10 digits');
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleRelChange = (i, e) => {
    const { name, value } = e.target;
    if (name === 'contactNumber' && !validateContact(value)) {
      return toast.error('Relative contact must be up to 10 digits');
    }
    const newR = [...form.relatives];
    newR[i][name] = value;
    setForm((p) => ({ ...p, relatives: newR }));
  };

  const addRelative = () => {
    if (form.relatives.length < 3) {
      setForm((p) => ({
        ...p,
        relatives: [...p.relatives, { name: '', contactNumber: '', relationship: '' }]
      }));
    } else {
      toast.warning('Only 3 relatives allowed');
    }
  };

  const removeRelative = (i) => {
    setForm((p) => ({
      ...p,
      relatives: p.relatives.filter((_, idx) => idx !== i)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    if (!token) return toast.error('Please log in first');
    try {
      const res = await axios.post('http://localhost:8000/api/receptionist/patients', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 201) {
        setSubmittedData(res.data.patient);
        toast.success('Patient registered successfully!');
      } else {
        toast.error('Unexpected server response');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const handlePrint = () => {
    const content = printRef.current.outerHTML;
    const w = window.open('', '', 'width=800,height=600');
    w.document.write(`<html><head><title>Patient Details</title></head><body>${content}</body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: '1.5rem' }}>👩‍⚕️ Register Patient</h2>
      <form onSubmit={handleSubmit}>
        {/* Full Name & DOB */}
        <div style={twoCol}>
          <input
            name="fullName"
            placeholder="👤 Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
          <input
            type="date"
            name="dob"
            placeholder="📅 Date of Birth"
            value={form.dob}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
        </div>

        {/* Gender & Contact */}
        <div style={twoCol}>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          >
            <option value="">⚥ Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            name="contactNumber"
            placeholder="📞 Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
            maxLength={10}
          />
        </div>

        {/* Email & Address */}
        <div style={twoCol}>
          <input
            name="email"
            type="email"
            placeholder="✉️ Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
          <input
            name="address"
            placeholder="🏠 Address"
            value={form.address}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
        </div>

        {/* Relatives */}
        <h4 style={{ margin: '1rem 0 0.5rem' }}>👥 Relatives</h4>
        {form.relatives.map((rel, i) => (
          <div key={i} style={relRow}>
            <input
              name="name"
              placeholder="👥 Relative Name"
              value={rel.name}
              onChange={(e) => handleRelChange(i, e)}
              required
              style={{ flex: 1 }}
            />
            <input
              name="contactNumber"
              placeholder="📞 Relative Contact"
              value={rel.contactNumber}
              onChange={(e) => handleRelChange(i, e)}
              required
              style={{ flex: 1 }}
              maxLength={10}
            />
            <input
              name="relationship"
              placeholder="🔗 Relationship"
              value={rel.relationship}
              onChange={(e) => handleRelChange(i, e)}
              required
              style={{ flex: 1 }}
            />
            {form.relatives.length > 1 && (
              <button
                type="button"
                onClick={() => removeRelative(i)}
                style={{
                  backgroundColor: '#d32f2f',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addRelative}
          style={{
            display: 'block',
            margin: '0.5rem 0 1.5rem',
            padding: '6px 12px'
          }}
        >
          + Add Relative
        </button>

        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Register Patient
        </button>
      </form>

      {submittedData && (
        <div style={{ marginTop: '2rem' }}>
          <button onClick={handlePrint}>Print Patient Details</button>
          <div ref={printRef} style={{ display: 'none' }}>
            <h2>Patient Registration Details</h2>
            <p><strong>Patient ID:</strong> {submittedData.patientId}</p>
            <p><strong>Name:</strong> {submittedData.fullName}</p>
            <p><strong>DOB:</strong> {new Date(submittedData.dob).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> {submittedData.gender}</p>
            <p><strong>Contact:</strong> {submittedData.contactNumber}</p>
            <p><strong>Email:</strong> {submittedData.email}</p>
            <p><strong>Address:</strong> {submittedData.address}</p>
            <h4>Relatives:</h4>
            <ul>
              {submittedData.relatives.map((r, idx) => (
                <li key={idx}>{r.name} &ndash; {r.relationship} &ndash; {r.contactNumber}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default PatientForm;
