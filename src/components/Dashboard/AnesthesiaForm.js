import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

const AnesthesiaForm = () => {
  const { procedureId } = useParams();  // from /anesthesia/:procedureId
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    procedureScheduleId: procedureId,
    anestheticId: '',
    anesthesiaName: '',
    anesthesiaType: '',
    induceTime: '',
    endTime: '',
    medicinesUsedText: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    axios.get('http://localhost:8000/api/receptionist/doctors', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setDoctors(res.data.doctors || []);
    }).catch(err => {
      toast.error('Failed to load doctors');
    });
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    try {
      const res = await axios.post(
        'http://localhost:8000/api/procedures/anesthesia-records',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Anesthesia record saved!');
      console.log(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save anesthesia record');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#f5f5f5', borderRadius: '10px' }}>
      <h2>Anesthesia Record</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <select name="anestheticId" value={form.anestheticId} onChange={handleChange} required>
          <option value="">Select Anesthetist</option>
          {doctors.map(doc => (
            <option key={doc._id} value={doc._id}>{doc.userId?.name}</option>
          ))}
        </select>

        <input name="anesthesiaName" value={form.anesthesiaName} onChange={handleChange} placeholder="Anesthesia Name" required />
        
        <select name="anesthesiaType" value={form.anesthesiaType} onChange={handleChange} required>
          <option value="">Anesthesia Type</option>
          <option value="General">General</option>
          <option value="Local">Local</option>
          <option value="Epidural">Epidural</option>
        </select>

        <input type="datetime-local" name="induceTime" value={form.induceTime} onChange={handleChange} />
        <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} />
        <textarea name="medicinesUsedText" value={form.medicinesUsedText} onChange={handleChange} placeholder="Medicines used (optional)" />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          Save Record
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AnesthesiaForm;
