import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAdmissionAdvice } from '../../context/AdmissionAdviceContext';


const IPDAdmissionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('jwt');
const { adviceData, setAdviceData } = useAdmissionAdvice();


const patient = location.state?.patient || null;
const visit = location.state?.visit || null;


const initialVisitId = adviceData?.visitId || visit?._id || '';
const initialAdmittingDoctorId = adviceData?.admittingDoctorId || visit?.assignedDoctorId || '';
const [patientDbId, setPatientDbId] = useState(
  adviceData?.patientDbId || 
  patient?.patientDbId || 
  patient?.id || ''
);

// const [patientId, setPatientId] = useState(initialPatientId);
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

const BASE_URL = process.env.REACT_APP_BASE_URL;


 useEffect(() => {
  fetchWards();
  fetchRoomCategories();

  

}, []);






useEffect(() => {
  if (adviceData) {
    setPatientDbId(adviceData.patientDbId || '');
    setVisitId(adviceData.visitId || '');
    setAdmittingDoctorId(adviceData.admittingDoctorId || '');
    setPatientName(adviceData.patientName || '');
    setDoctorName(adviceData.doctorName || '');
  }
}, [adviceData]);


  const fetchWards = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/receptionist/wards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWards(res.data.wards || []);
    } catch (err) {
      toast.error('Failed to load wards');
    }
  };

  const fetchRoomCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/receptionist/room-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoomCategories(res.data.roomCategories || []);
    } catch (err) {
      toast.error('Failed to load room categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting for patientId=', patientDbId);
  console.log('Admitting Doctor ID:', admittingDoctorId);
console.log("🚀 Sending payload:", {
  patientId: patientDbId,
  visitId,
  wardId,
  bedNumber,
  roomCategoryId,
  admittingDoctorId,
  expectedDischargeDate
});
// const missingFields = [];
// if (!patientDbId) missingFields.push('patientId');
// if (!visitId) missingFields.push('visitId');
// if (!wardId) missingFields.push('wardId');
// if (!bedNumber) missingFields.push('bedNumber');
// if (!roomCategoryId) missingFields.push('roomCategoryId');
// if (!admittingDoctorId) missingFields.push('admittingDoctorId');

// console.log('Missing fields:', missingFields);



  if (!patientDbId || !visitId || !wardId || !bedNumber || !roomCategoryId || !admittingDoctorId) {
      return toast.error('All required fields must be filled.');
    }

    const chosenWard = wards.find(w => w._id === wardId);
    if (!chosenWard || !chosenWard.beds.some(b => b.bedNumber === bedNumber && b.status === 'available')) {
      return toast.error('Selected bed is not available');
    }

    const payload = {
      patientId:patientDbId, 

      visitId,
      wardId,
      bedNumber,
      roomCategoryId,
      admittingDoctorId,
      expectedDischargeDate
    };
console.log("Payload to send:", payload);

    try {
      await axios.post(`${BASE_URL}/api/ipd/admissions`, payload, {
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
setPatientDbId("");
  setDoctorName("");
  setVisitId('');
  setAdmittingDoctorId('');
  setWardId('');
  setBedNumber('');
  setRoomCategoryId('');
  setExpectedDischargeDate('');
  setSubmitted(false); // In case it's needed
    setAdviceData(null);
  toast.info('Admission form reset.');
};

  
const handleView = () => {
  if (!patientDbId) {
    return toast.error('No patient selected.');
  }
  navigate(`/receptionist-dashboard/IPDAdmissionList/${patientDbId}`, {
    state: {
      patientName, // 👈 pass patient name here
    },
  });
};



  return (
     <div style={{ maxWidth: 600, margin: '2rem auto' }}>
             <ToastContainer/>
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