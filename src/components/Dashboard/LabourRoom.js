import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';


// Basic modal styles; customize as needed
const modalOverlay = {
  position: 'fixed', top: "50px", left: 0, width: '100vw', height: '100vh',
  background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 1000
};

const modalContent = {
  background: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '500px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxSizing: 'border-box', // Add this
};


const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0',
  marginBottom: '1rem',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

const thStyle = {
  backgroundColor: '#e6f7ff',
  padding: '12px',
  borderBottom: '1px solid #ccc',
  fontWeight: 'bold',
  textAlign: 'left',
};

const tdStyle = {
  backgroundColor: '#f9f9f9',
  padding: '12px',
  borderBottom: '1px solid #ddd',
};


const cornerButton = {
  padding: '6px 12px', margin: '0.25rem', cursor: 'pointer'
};

const LabourRoom = () => {
  const [labourProcedures, setLabourProcedures] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [form, setForm] = useState({
    babyName: '', gender: '', dobBaby: '', timeOfBirth: '',
    weight: '', deliveryType: ''
  });
const BASE_URL = process.env.REACT_APP_BASE_URL;

  const token = localStorage.getItem('jwt');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};

  //︁1. Fetch patients and their labour room schedules
  useEffect(() => {
    const fetchAllLabourProcedures = async () => {

      try {
        const patientRes = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const pts = patientRes.data.patients;
        setPatients(pts);
        

        let allLabour = [];
        await Promise.all(pts.map(async p => {
  const sched = await axios.get(`${BASE_URL}/api/procedures/schedules/${p._id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const labourOnly = (sched.data.procedures || [])
    .filter(proc => proc.procedureType === 'Labour Room');

  // 🔑 check if labour details already exist
  for (let proc of labourOnly) {
    try {
      const detailRes = await axios.get(
        `${BASE_URL}/api/procedures/labour-details/${proc._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!detailRes.data.detail) {
        proc.patientObj = p;
        allLabour.push(proc);
      }
    } catch {
      // if endpoint fails or no detail, still include
      proc.patientObj = p;
      allLabour.push(proc);
    }
  }
}));
setLabourProcedures(allLabour);

      } catch (err) {
        toast.error('Failed to fetch Labour Room procedures');
      }
    };
    fetchAllLabourProcedures();
  }, [token]);

  //︁2. Load existing details once “selectedProcedure” is set
  useEffect(() => {
    const fetchDetail = async () => {
      if (!selectedProcedure) return;
      try {
        const res = await axios.get(`${BASE_URL}/api/procedures/labour-details/${selectedProcedure._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.detail) setForm(res.data.detail);
        else setForm({ babyName: '', gender: '', dobBaby: '', timeOfBirth: '', weight: '', deliveryType: '' });
      } catch {
        setForm({ babyName: '', gender: '', dobBaby: '', timeOfBirth: '', weight: '', deliveryType: '' });
      }
    };
    fetchDetail();
  }, [selectedProcedure, token]);

  //︁3. Form input handler
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  //︁4. Save labour room form
  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedProcedure) return;
    const payload = {
      ...form,
      procedureScheduleId: selectedProcedure._id,
     patientId: selectedProcedure.patientObj?._id, 
     capturedByUserId: user._id || user.id
    };
    try {
      await axios.post(`${BASE_URL}/api/procedures/labour-details`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Labour room details saved!');
      setLabourProcedures(prev => prev.filter(p => p._id !== selectedProcedure._id));
      setSelectedProcedure(null);
      setForm({ babyName: '', gender: '', dobBaby: '', timeOfBirth: '', weight: '', deliveryType: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save details');
    }
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <h2>Labour Room Scheduled Patients</h2>

      <table style={tableStyle}>
       <thead>
  <tr>
    <th style={thStyle}>Sr. No.</th>
    <th style={thStyle}>Patient</th>
    <th style={thStyle}>Scheduled Date</th>
    <th style={thStyle}>Actions</th>
  </tr>
</thead>

   <tbody>
  {labourProcedures.length === 0 ? (
    <tr>
      <td style={{ ...tdStyle, textAlign: 'center' }} colSpan="4">
        No Labour Room schedules.
      </td>
    </tr>
  ) : labourProcedures.map((p, idx) => (
    <tr key={p._id}>
      <td style={{ ...tdStyle, backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f0f8ff' }}>
        {idx + 1}
      </td>
      <td style={{ ...tdStyle, backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f0f8ff' }}>
        {patients.find(pt => pt._id === p.patientId)?.fullName || p.patientId}
      </td>
      <td style={{ ...tdStyle, backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f0f8ff' }}>
        {new Date(p.scheduledDateTime).toLocaleString()}
      </td>
      <td style={{ ...tdStyle, backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f0f8ff' }}>
        <IconButton
          onClick={() => setSelectedProcedure(p)}
          style={{ padding: '6px' }}
          color="primary"
        >
          <EditIcon />
        </IconButton>
      </td>
    </tr>
  ))}
</tbody>


      </table>

      {selectedProcedure && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Labour Room Details – {patients.find(pt => pt._id === selectedProcedure.patientId)?.fullName}</h3>
           <form
  onSubmit={handleSubmit}
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    width: '100%',
    boxSizing: 'border-box'
  }}
>

              <input name="babyName" value={form.babyName} onChange={handleChange} placeholder="Baby Name" required style={{ width: '100%', padding: '0.5em', fontSize: '1em' }}
/>
              <select name="gender" value={form.gender} onChange={handleChange} required style={{ width: '100%', padding: '0.5em', fontSize: '1em' }}
>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input type="date" name="dobBaby" value={form.dobBaby} onChange={handleChange} required  style={{ width: '100%', padding: '0.5em', fontSize: '1em' }}
/>
              <input type="time" name="timeOfBirth" value={form.timeOfBirth} onChange={handleChange} required style={{ width: '100%', padding: '0.5em', fontSize: '1em' }}
 />
              <input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight (e.g. 2.8 kg)" style={{ width: '100%', padding: '0.5em', fontSize: '1em' }}
 />
              <select name="deliveryType" value={form.deliveryType} onChange={handleChange} required style={{ width: '100%', padding: '0.5em', fontSize: '1em' }}
>
                <option value="">Delivery Type</option>
                <option value="Normal">Normal</option>
                <option value="C-section">C-section</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedProcedure(null)}
                  style={{ ...cornerButton, background: '#ccc' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...cornerButton, background: '#28a745', color: '#fff' }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LabourRoom;
