import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import io from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:8000', {
  withCredentials: true,
});

const IPDAdmissionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('jwt');

  const visit = location.state?.visit || null;

  const [patientId, setPatientId] = useState(visit?.patientDbId?._id || '');
  const [visitId, setVisitId] = useState(visit?._id || '');
const [admittingDoctorId, setAdmittingDoctorId] = useState(visit?.assignedDoctorId || '');



  const [wardId, setWardId] = useState('');
  const [bedNumber, setBedNumber] = useState('');
  const [roomCategoryId, setRoomCategoryId] = useState('');
  const [expectedDischargeDate, setExpectedDischargeDate] = useState('');

  const [wards, setWards] = useState([]);
  const [roomCategories, setRoomCategories] = useState([]);

  useEffect(() => {
    fetchWards();
    fetchRoomCategories();

    // 🧠 Join receptionist room and listen for doctor IPD advice
    socket.emit('joinReceptionistRoom');

    socket.on('newIPDAdmissionAdvice', (data) => {
      toast.info(`Doctor advised admission for Patient ID: ${data.patientId}`);

      // ✅ Auto-fill the form from socket event
      setPatientId(data.patientId || '');
      setVisitId(data.visitId || '');
      setAdmittingDoctorId(data.admittingDoctorId || '');
    });

    return () => {
      socket.off('newIPDAdmissionAdvice');
    };
  }, []);

  const fetchWards = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/receptionist/wards', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWards(res.data.wards || []);
    } catch (err) {
      toast.error('Failed to load wards');
    }
  };

  const fetchRoomCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/receptionist/room-categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoomCategories(res.data.roomCategories || []);
    } catch (err) {
      toast.error('Failed to load room categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  console.log('Admitting Doctor ID:', admittingDoctorId);
    if (!patientId || !visitId || !wardId || !bedNumber || !roomCategoryId || !admittingDoctorId) {
      return toast.error('All required fields must be filled.');
    }

    const chosenWard = wards.find(w => w._id === wardId);
    if (!chosenWard || !chosenWard.beds.some(b => b.bedNumber === bedNumber && b.status === 'available')) {
      return toast.error('Selected bed is not available');
    }

    const payload = {
      patientId,
      visitId,
      wardId,
      bedNumber,
      roomCategoryId,
      admittingDoctorId,
      expectedDischargeDate
    };

    try {
      await axios.post('http://localhost:8000/api/ipd/admissions', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('IPD Admission successful!');
      setTimeout(() => navigate('/reception-dashboard'), 2000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'IPD Admission failed.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ textAlign: 'center' }}>IPD Admission</h2>

        <div>
          <label>Patient ID</label>
          <input type="text" value={patientId} readOnly />
        </div>

        <div>
          <label>Visit ID</label>
          <input type="text" value={visitId} readOnly />
        </div>

        <div>
        <p>Doctor ID: {admittingDoctorId}</p>
<p>Doctor Name: {visit?.assignedDoctor?.fullName}</p>

        </div>

        <div>
          <label>Ward</label>
          <select value={wardId} onChange={(e) => setWardId(e.target.value)} required>
            <option value="">Select Ward</option>
            {wards.map(ward => (
              <option key={ward._id} value={ward._id}>{ward.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Bed Number</label>
          <input
            type="text"
            value={bedNumber}
            onChange={(e) => setBedNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Room Category</label>
          <select value={roomCategoryId} onChange={(e) => setRoomCategoryId(e.target.value)} required>
            <option value="">Select Room Category</option>
            {roomCategories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Expected Discharge Date</label>
          <input
            type="date"
            value={expectedDischargeDate}
            onChange={(e) => setExpectedDischargeDate(e.target.value)}
          />
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white' }}>
            Admit
          </button>
          <button type="button" onClick={() => navigate(-1)} style={{ padding: '10px 20px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default IPDAdmissionForm;
