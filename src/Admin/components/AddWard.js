import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddWard = () => {
  const [form, setForm] = useState({
    name: '',
    roomCategory: '',
    beds: [{ bedNumber: '', status: 'available' }]
  });
  const [roomCategories, setRoomCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(true);

  // Bulk upload state
  const [file, setFile] = useState(null);
  const [bulkMessage, setBulkMessage] = useState('');
  const [bulkErrors, setBulkErrors] = useState([]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchRoomCategories = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await axios.get(`${BASE_URL}/api/admin/room-categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoomCategories(res.data.roomCategories || []);
      } catch (err) {
        console.error('Failed to load room categories:', err);
      }
    };
    fetchRoomCategories();
  }, []);

  // --------------------- Bulk Upload Handlers ---------------------
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setBulkMessage('');
    setBulkErrors([]);
  };

  const handleBulkUpload = async () => {
    if (!file) return setBulkMessage('Please select a file to upload.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.post(`${BASE_URL}/api/admin/wards/bulk`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      setBulkMessage(res.data.message + ` (${res.data.count} wards uploaded)`);
      setFile(null);
      document.getElementById('bulkFileInput').value = '';
      setBulkErrors([]);
    } catch (err) {
      const data = err.response?.data;
      setBulkMessage(data?.message || 'Upload failed');
      if (data?.errorRows) setBulkErrors(data.errorRows);
    }
  };

  // --------------------- Single Ward Form Handlers ---------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleBedChange = (index, e) => {
    const updatedBeds = [...form.beds];
    updatedBeds[index][e.target.name] = e.target.value;
    setForm({ ...form, beds: updatedBeds });
    setErrors({ ...errors, [`bed-${index}`]: '' });
  };

  const addBedField = () => setForm({ ...form, beds: [...form.beds, { bedNumber: '', status: 'available' }] });
  const removeBedField = (index) => {
    const updatedBeds = [...form.beds];
    updatedBeds.splice(index, 1);
    setForm({ ...form, beds: updatedBeds });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Ward name is required";

    const bedNumbers = form.beds.map(b => b.bedNumber.trim());
    const duplicates = bedNumbers.filter((item, i, arr) => arr.indexOf(item) !== i);
    const specialCharPattern = /[^a-zA-Z0-9]/;

    form.beds.forEach((bed, i) => {
      const key = `bed-${i}`;
      if (!bed.bedNumber.trim()) errs[key] = "Bed number is required";
      else if (specialCharPattern.test(bed.bedNumber)) errs[key] = "No special characters allowed";
      else if (duplicates.includes(bed.bedNumber.trim())) errs[key] = "Duplicate bed number";
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;

    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(`${BASE_URL}/api/admin/wards`, form, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setMessage(res.data.message);
      setForm({ name: '', roomCategory: '', beds: [{ bedNumber: '', status: 'available' }] });
      setErrors({});
      setShowForm(false);
    } catch (error) {
      const data = error.response?.data;
      if (data?.message === "Ward already exists.") setErrors({ name: data.message });
      else setMessage(data?.message || "Something went wrong.");
    }
  };

  const toggleForm = () => { setShowForm(true); setMessage(''); };

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Add Ward</h2>

      {/* ---------- Bulk Upload Section ---------- */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Bulk Upload Wards</h3>
        <input type="file" id="bulkFileInput" accept=".xlsx,.xls" onChange={handleFileChange} />
        <button type="button" onClick={handleBulkUpload} style={styles.addBtn}>Upload</button>
        {bulkMessage && <p style={{ color: 'green' }}>{bulkMessage}</p>}
        {bulkErrors.length > 0 && (
          <p style={{ color: 'red' }}>Validation failed at rows: {bulkErrors.join(', ')}</p>
        )}
      </div>

      {/* ---------- Single Ward Form ---------- */}
      {showForm ? (
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Name:</label><br />
            <input type="text" name="name" value={form.name} onChange={handleChange} required style={styles.input} />
            {errors.name && <span style={styles.error}>{errors.name}</span>}
          </div>

          <div style={styles.field}>
            <label>Room Category:</label><br />
            <select name="roomCategory" value={form.roomCategory} onChange={handleChange} required style={styles.input}>
              <option value="">Select Category</option>
              {roomCategories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name} - {cat.description}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label>Beds:</label>
            {form.beds.map((bed, index) => (
              <div key={index} style={styles.bedRow}>
                <input type="text" name="bedNumber" value={bed.bedNumber} onChange={(e) => handleBedChange(index, e)} placeholder="Bed Number" required style={styles.bedInput} />
                <select name="status" value={bed.status} onChange={(e) => handleBedChange(index, e)} style={styles.bedSelect}>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="cleaning">Cleaning</option>
                </select>
                <button type="button" onClick={() => removeBedField(index)} style={styles.removeBtn}>Remove</button>
                {errors[`bed-${index}`] && <span style={styles.error}>{errors[`bed-${index}`]}</span>}
              </div>
            ))}
            <button type="button" onClick={addBedField} style={styles.addBtn}>+ Add Bed</button>
          </div>

          <button type="submit" style={styles.submitBtn}>Submit</button>
        </form>
      ) : (
        <p style={styles.message} onClick={toggleForm}>✅ {message} — click here to add another ward</p>
      )}
    </div>
  );
};

const styles = {
  card: { maxWidth: "90%", width: "700px", margin: "40px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  heading: { marginBottom: "20px", textAlign: "center" },
  field: { marginBottom: "15px" },
  input: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  bedRow: { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" },
  bedInput: { flex: "2 1 200px", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", minWidth: "80px" },
  bedSelect: { flex: "1 1 120px", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" },
  removeBtn: { background: "#e74c3c", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 12px", cursor: "pointer", flex: "0 0 auto" },
  addBtn: { marginTop: "5px", background: "#3498db", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "6px", cursor: "pointer" },
  submitBtn: { padding: "12px 12px", backgroundColor: "#2ecc71", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%", marginTop: "10px" },
  message: { marginTop: "20px", color: "green", textAlign: "center" },
  error: { color: "red", fontSize: "0.85rem", marginTop: "5px", display: "block" }
};

export default AddWard;
