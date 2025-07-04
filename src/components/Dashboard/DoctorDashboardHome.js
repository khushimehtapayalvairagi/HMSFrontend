import React, { useEffect, useState,useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import OPDConsultationForm from './OPDConsultationForm';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
const socket = io('http://localhost:8000', {
  withCredentials: true,
});

const DoctorDashboardHome = () => {
  const [assignedVisits, setAssignedVisits] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [expandedVisitId, setExpandedVisitId] = useState(null);
const navigate = useNavigate();
const toastDisplayedRef = useRef(false);
const { visitId } = useParams();
const doctorRef = useRef(null);
  const tokenRef = useRef(null);
const socketInitialized = useRef(false);
const location = useLocation();
useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('jwt');
  setDoctor(storedUser);
  doctorRef.current = storedUser;
  tokenRef.current = token;
  console.log("Token:", token);
  console.log("Local user object:", storedUser);
}, []);





  
const fetchVisits = async () => {
  const token = tokenRef.current;
  const doctorId = doctorRef.current?.id;

  if (!doctorId || !token) {
    console.warn("Missing doctorId or token");
    return;
  }

  try {
    const res = await axios.get(
      `http://localhost:8000/api/doctor/visits/doctor/${doctorId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setAssignedVisits(res.data.visits || []);
  } catch (err) {
    console.error('Error fetching assigned visits:', err.response?.data || err);
  }
};

// const handleRemoveVisit = async (visitIdToRemove) => {
//   const token = tokenRef.current;
//   try {
//     await axios.delete(`http://localhost:8000/api/doctor/visits/${visitIdToRemove}`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     // Update frontend immediately
//     setAssignedVisits(prev =>
//       prev.filter(visit => visit._id !== visitIdToRemove)
//     );

//     toast.info('Declined visit removed.');
//   } catch (err) {
//     console.error('Error removing visit:', err.response?.data || err);
//     toast.error('Failed to remove declined visit.');
//   }
// };

useEffect(() => {
  if (!doctor) return;

  const doctorId = doctor.id;
  doctorRef.current = doctor;
  tokenRef.current = localStorage.getItem('jwt');

  socket.emit('joinDoctorRoom', doctorId);
  console.log('Joined doctor room:', doctorId);

  if (!socketInitialized.current) {
    socket.on('newAssignedPatient', async (data) => {
      if (data.doctorId === doctorRef.current?.id) {
        await fetchVisits();
        toast.success(`🩺 New patient assigned: ${data.patientName || 'Patient'}`);
      }
    });

    socketInitialized.current = true;
  }

  fetchVisits();

  return () => {
    socket.off('newAssignedPatient');
    socketInitialized.current = false;
  };
}, [doctor]);


// useEffect(() => {
//   const interval = setInterval(() => {
//     fetchVisits();
//    toast.success('🩺 New patient assigned !');
//   }, );

//   return () => clearInterval(interval);
// }, []);


// useEffect(() => {
//   if (location.state?.consultationDone) {
//     toast.success('Consultation completed successfully!');
//   }
// }, [location]);
 

  return (
    <div>
      <h2>Welcome {doctor?.name}</h2>
      <h3>Assigned Patients</h3>
   {assignedVisits
  .filter(visit => visit.status === 'Waiting' )
  .map((visit) => (
    <div key={visit._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
      <h4>Consultation for Patient:</h4>
      <p><strong>Patient ID:</strong> {visit.patientId}</p>
      <p><strong>Patient Name:</strong> {visit.patientDbId?.fullName || 'N/A'}</p>
      <p><strong>Visit ID:</strong> {visit._id}</p>
      <p><strong>Status:</strong> {visit.status}</p>
   
  
      {visit.status !== 'Completed' && (
  <div style={{ display: 'flex', gap: '10px' }}>
    <button onClick={() => navigate(`/doctor-dashboard/ConsultationForm/${visit._id}`, { state: { visit } })}>
      Start Consultation
    </button>
    {visit.patientDbId?._id && (
      <button onClick={() => navigate(`/doctor-dashboard/PreviousConsultantPatient/${visit.patientDbId._id}`)}>
        View Previous Consultations
      </button>
    )}
  </div>
  
)}
</div>
))}


        <ToastContainer position="top-right" autoClose={3000} />
    </div>
   
  );
}

export default DoctorDashboardHome;
