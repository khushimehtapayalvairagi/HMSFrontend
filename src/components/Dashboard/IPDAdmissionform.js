import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import io from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';
import { useAdmissionAdvice } from '../../context/AdmissionAdviceContext';
// const socket = io('http://localhost:8000', {
//   withCredentials: true,
// });

const IPDAdmissionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('jwt');
const { adviceData } = useAdmissionAdvice();

const patient = location.state?.patient || null;
const visit = location.state?.visit || null;

const initialPatientId = adviceData?.patiendDbId || patient?.id || patient || '';
const initialVisitId = adviceData?.visitId || visit?._id || '';
const initialAdmittingDoctorId = adviceData?.doctorId || visit?.assignedDoctorId || '';

const [patientId, setPatientId] = useState(initialPatientId);
const [visitId, setVisitId] = useState(initialVisitId);
const [admittingDoctorId, setAdmittingDoctorId] = useState(initialAdmittingDoctorId);

const [patientName, setPatientName] = useState(adviceData?.patientName || patient?.name || visit?.patientName || '');

const [doctorName, setDoctorName] = useState(location.state?.patient?.doctorName || '');




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
 console.log('Joined receptionist room:');
  socket.on('newIPDAdmissionAdvice', (data) => {
    toast.info(`Doctor advised admission for Patient ID: ${data.patientId}`);

    setPatientId(data.patientId || '');
    setVisitId(data.visitId || '');
    setAdmittingDoctorId(data.admittingDoctorId || data.doctorId || '');
setPatientName(data.patientName || '');
setDoctorName(data.doctorName || '');


    
  });

  

  return () => {
    socket.off('newIPDAdmissionAdvice');
  };
}, []);

// useEffect(() => {
//   const fetchPatientName = async () => {
//     if (!patientId || patientName) return;
//     try {
//       const res = await axios.get(`http://localhost:8000/api/receptionist/patients/${patientId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Patient API Response:", res.data);
//       setPatientName(res.data.fullName || res.data.patient?.fullName || '');
//     } catch (err) {
//       console.error('Error fetching patient name:', err);
//       toast.error('Failed to fetch patient name');
//     }
//   };

//   fetchPatientName();
// }, [patientId, patientName, token]);





useEffect(() => {
  // console.log(adviceData);
  if (adviceData?.doctorName) {
    setDoctorName(adviceData.doctorName);
  }

  if (adviceData?.patientName) {
    setPatientName(adviceData.patientName);
  }

  if(adviceData?.patiendDbId){
    setPatientId(adviceData.patiendDbId);
  }

  if(adviceData?.doctorId){
    setAdmittingDoctorId(adviceData.doctorId);
  }

  if(adviceData?.visitId){
    setVisitId(adviceData.visitId);
  }
}, [adviceData]);


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
    console.log('Submitting for patientId=',patientId);
    console.log('Admitting Doctor ID:', admittingDoctorId);
    console.log(visitId);
    console.log(wardId);
    console.log(bedNumber);
    console.log(roomCategoryId);
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
  const handleCancel = () => {
  // Clear all input fields
  setPatientName('');
  setDoctorName("");
  setVisitId('');
  setAdmittingDoctorId('');
  setWardId('');
  setBedNumber('');
  setRoomCategoryId('');
  setExpectedDischargeDate('');
  setSubmitted(false); // In case it's needed
  toast.info('Admission form reset.');
};

  
const handleView = () => {
  if (!patientId) {
    return toast.error('No patient selected.');
  }
  navigate(`/receptionist-dashboard/IPDAdmissionList/${patientId}`, {
    state: {
      patientName, // 👈 pass patient name here
    },
  });
};



  return (
     <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {!submitted ? (
        <>
   
          <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>IPD Admission</h2>

  <div>
  <label>Patient:</label>
  <input readOnly value={patientName } />
</div>

<div>
  <label>DoctorName:</label>
  <input readOnly value={doctorName || admittingDoctorId} />
</div>


          
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

          <div style={{ marginTop: 15, display: 'flex', gap: '1rem' }}>
  <button type="submit" style={{ flex: 1, backgroundColor: '#1976d2', color: 'white', padding: '0.5rem', border: 'none', borderRadius: 4 }}>
    Admit
  </button>
  <button type="button" onClick={handleCancel} style={{ flex: 1, backgroundColor: '#9e9e9e', color: 'white', padding: '0.5rem', border: 'none', borderRadius: 4 }}>
    Cancel
  </button>
</div>

          </form>
        </>
      ) : (
        <div style={{ padding: '2rem', border: '1px solid #28a745', color: '#28a745', borderRadius: 8, textAlign: 'center' }}>
          <p>✅ Admission completed for patient {patientName}</p>
          <button onClick={handleView}>View Admissions</button>
        </div>
      )}
    </div>
  );
};

export default IPDAdmissionForm;