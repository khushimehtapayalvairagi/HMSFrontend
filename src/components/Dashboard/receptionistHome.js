// import React, { useEffect } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import io from 'socket.io-client';
// import 'react-toastify/dist/ReactToastify.css';

// // initialize socket outside component to avoid re-creating
// const socket = io('http://localhost:8000', {
//   withCredentials: true,
// });

// const ReceptionistHome = () => {
//   useEffect(() => {
//     // join receptionist room
//     socket.emit('joinReceptionistRoom');

//     // listen for new IPD admission advice
//     socket.on('newIPDAdmissionAdvice', (data) => {
//       toast.info(
//         `New IPD Admission Advised:\nPatient ID: ${data.patientId}\nChief Complaint: ${data.chiefComplaint}`,
//         { autoClose: 4000 }
//       );
//     });

//     return () => {
//       socket.off('newIPDAdmissionAdvice');
//     };
//   }, []);

//   return (
//     <div style={{ padding: '1rem' }}>
//       <h2>Welcome Receptionist</h2>
//       {/* This is important to display toasts */}
//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default ReceptionistHome;
