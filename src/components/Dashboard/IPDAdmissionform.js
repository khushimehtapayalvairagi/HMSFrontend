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
 const patient = location.state?.patient || null;
  const visit = location.state?.visit || null;
const [patientName, setPatientName] = useState(visit?.patientDbId?.fullName || '');

const [doctorName, setDoctorName] = useState('');
 const [patientId, setPatientId] = useState(visit?.patientDbId || '');

  const [visitId, setVisitId] = useState(visit?._id || '');
const [admittingDoctorId, setAdmittingDoctorId] = useState(visit?.assignedDoctorId || '');


 const [submitted, setSubmitted] = useState(false);
  const [wardId, setWardId] = useState('');
  const [bedNumber, setBedNumber] = useState('');
  const [roomCategoryId, setRoomCategoryId] = useState('');
  const [expectedDischargeDate, setExpectedDischargeDate] = useState('');

  const [wards, setWards] = useState([]);
  const [roomCategories, setRoomCategories] = useState([]);

 useEffect(() => {
  fetchWards();
  fetchRoomCategories();

  
  socket.emit('joinReceptionistRoom');

  socket.on('newIPDAdmissionAdvice', (data) => {
    toast.info(`Doctor advised admission for Patient ID: ${data.patientId}`);

    setPatientId(data.patientId || '');
    setVisitId(data.visitId || '');
    setAdmittingDoctorId(data.admittingDoctorId || '');

    
  });

  

  return () => {
    socket.off('newIPDAdmissionAdvice');
  };
}, []);

// const fetchDoctorName = async (doctorId) => {
//   try {
//     const res = await axios.get(`http://localhost:8000/api/receptionist/doctor/${doctorId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setDoctorName(res.data.doctor?.userId?.name || 'Unknown Doctor');
//   } catch (err) {
//     console.error('Error fetching doctor name:', err);
//     setDoctorName('Unknown Doctor');
//   }
// };

// const fetchPatientName = async (patientId) => {
//   try {
//     const res = await axios.get(`http://localhost:8000/api/receptionist/patient/${patientId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setPatientName(res.data.patient?.fullName || 'Unknown Patient');
//   } catch (err) {
//     console.error('Error fetching patient name:', err);
//     setPatientName('Unknown Patient');
//   }
// };useEffect(() => {
//   if (patientId) fetchPatientName(patientId);
// }, [patientId]);

// useEffect(() => {
//   if (admittingDoctorId) fetchDoctorName(admittingDoctorId);
// }, [admittingDoctorId]);


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
    console.log('Submitting for patientId=', patientId);
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
     setSubmitted(true);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'IPD Admission failed.');
    }
  };
  
 const handleView = () => {
  if (!patientId) {
    return toast.error('No patient selected.');
  }
  navigate(`/receptionist-dashboard/IPDAdmissionList/${patientId}`);
};


  return (
     <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {!submitted ? (
        <>
   
          <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>IPD Admission</h2>

       
  {/* <label>Patient:</label>
  <input readOnly value={patientName ? patientName : patientId} />
</div>

<div><label>Doctor:</label><input readOnly value={doctorName || admittingDoctorId} /></div> */}

          
            <div><label>Ward</label>
              <select value={wardId} onChange={e => setWardId(e.target.value)}>
                <option value="">Select ward</option>
                {wards.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
              </select>
            </div>

            <div><label>Bed Number</label>
              <input value={bedNumber} onChange={e => setBedNumber(e.target.value)} />
            </div>

            <div><label>Room Category</label>
              <select value={roomCategoryId} onChange={e => setRoomCategoryId(e.target.value)}>
                <option value="">Select category</option>
                {roomCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div><label>Expected Discharge</label>
              <input type="date" value={expectedDischargeDate} onChange={e => setExpectedDischargeDate(e.target.value)} />
            </div>

            <div style={{ marginTop: 15 }}>
              <button type="submit">Admit</button>
              <button type="button" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </>
      ) : (
        <div style={{ padding: '2rem', border: '1px solid #28a745', color: '#28a745', borderRadius: 8, textAlign: 'center' }}>
          <p>✅ Admission completed for patient {patientId}</p>
          <button onClick={handleView}>View Admissions</button>
        </div>
      )}
    </div>
  );
};

export default IPDAdmissionForm;