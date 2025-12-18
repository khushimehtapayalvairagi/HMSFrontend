import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AnesthesiaForm = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('jwt');

  const [patients, setPatients] = useState([]);
  const [admittedPatients, setAdmittedPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    patientId: '',
    anestheticId: '',
    anesthesiaName: '',
    anesthesiaType: '',
    induceTime: '',
    endTime: '',
    medicinesUsedText: ''
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allPatients = res.data.patients || [];

      // Now we check for admissions to filter only admitted
      const admittedList = [];

      for (const pat of allPatients) {
        try {
          const ipdRes = await axios.get(
            `${BASE_URL}/api/ipd/admissions/${pat._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const admissions = ipdRes.data.admissions || [];

          // If any active admission exists, add to admittedList
          if (admissions.some(adm => adm.status === 'Admitted')) {
            admittedList.push(pat);
          }
        } catch (err) {
          // ignore if not found
        }
      }

      setAdmittedPatients(admittedList);
    } catch (err) {
      toast.error('Failed to load patients');
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/receptionist/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data.doctors || []);
    } catch {
      toast.error('Failed to load doctors');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find the admissionId of the admitted patient
    let ipdAdmissionId = null;
    try {
      const ipdRes = await axios.get(
        `${BASE_URL}/api/ipd/admissions/${form.patientId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const admissions = ipdRes.data.admissions || [];
      const active = admissions.find(adm => adm.status === 'Admitted');
      ipdAdmissionId = active?._id;
    } catch (err) {
      toast.error('Error finding admission for patient');
      return;
    }

    if (!ipdAdmissionId) {
      return toast.error('Selected patient is not currently admitted.');
    }

    const payload = {
        patientId: form.patientId,      
      ipdAdmissionId,
      anestheticId: form.anestheticId,
      anesthesiaName: form.anesthesiaName,
      anesthesiaType: form.anesthesiaType,
      induceTime: form.induceTime || null,
      endTime: form.endTime || null,
      medicinesUsedText: form.medicinesUsedText || '',
        procedureType: form.procedureType
    };

    try {
      await axios.post(`${BASE_URL}/api/procedures/anesthesia-records`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Anesthesia record saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save anesthesia record');
    }
  };

  const handlePrint = () => window.print();

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#f5f5f5', borderRadius: '10px' }}>
      <h2>Anesthesia Record</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Only show patients who are currently admitted */}
        <select
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          required
        >
          <option value="">Select Admitted Patient</option>
          {admittedPatients.map(p => (
            <option key={p._id} value={p._id}>
              {p.fullName}
            </option>
          ))}
        </select>

        {/* Anesthetist */}
        <select
          name="anestheticId"
          value={form.anestheticId}
          onChange={handleChange}
          required
        >
          <option value="">Select Anesthetist</option>
          {doctors.map(doc => (
            <option key={doc._id} value={doc._id}>
              {doc.userId?.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="anesthesiaName"
          value={form.anesthesiaName}
          onChange={handleChange}
          placeholder="Anesthesia Name"
          required
        />

        <select
          name="anesthesiaType"
          value={form.anesthesiaType}
          onChange={handleChange}
          required
        >
          <option value="">Anesthesia Type</option>
          <option value="General">General</option>
          <option value="Local">Local</option>
          <option value="Epidural">Epidural</option>
        </select>
           <select
  name="procedureType"
  value={form.procedureType}
  onChange={handleChange}
  required
>
  <option value="">Procedure Type</option>
  <option value="OT">OT</option>
  <option value="Labour Room">Labour Room</option>
</select>

        <input
          type="datetime-local"
          name="induceTime"
          value={form.induceTime}
          onChange={handleChange}
        />

        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
        />

        <textarea
          name="medicinesUsedText"
          value={form.medicinesUsedText}
          onChange={handleChange}
          placeholder="Medicines used (optional)"
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          Save Record
        </button>

        <button type="button" onClick={handlePrint} style={{ padding: '10px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '5px' }}>
          🖨️ Print
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AnesthesiaForm;
