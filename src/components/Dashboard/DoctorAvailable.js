// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const DoctorAvailabilityForm = () => {
//   const [specialties, setSpecialties] = useState([]);
//   const [specialtyName, setSpecialtyName] = useState('');
//   const [dayOfWeek, setDayOfWeek] = useState('');
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch specialties on mount
//  useEffect(() => {
//   const fetchSpecialties = async () => {
//     const token = localStorage.getItem('jwt');

//     if (!token) {
//       alert("Token not found. Please log in again.");
//       return;
//     }

//     try {
//       const res = await axios.get('http://localhost:8000/api/receptionist/specialties', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSpecialties(res.data.specialties || []);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to load specialties');
//     }
//   };

//   fetchSpecialties();
// }, []);


//   const handleCheckAvailability = async (e) => {
//     e.preventDefault();

//     if (!specialtyName || !dayOfWeek) {
//       alert('Please select both specialty and day of the week.');
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('jwt');
//       const res = await axios.post(
//         'http://localhost:8000/api/receptionist/doctors',
//         { specialtyName, dayOfWeek },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setDoctors(res.data.doctors || []);
//     } catch (err) {
//       console.error('Doctor fetch error:', err);
//       alert(err.response?.data?.message || 'Failed to fetch available doctors.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: '600px', margin: '0 auto' }}>
//       <h2 style={{ textAlign: 'center' }}>Check Doctor Availability</h2>
      
//       <form onSubmit={handleCheckAvailability} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//         <div>
//           <label><strong>Specialty:</strong></label><br />
//           <select
//             value={specialtyName}
//             onChange={(e) => setSpecialtyName(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px' }}
//           >
//             <option value="">Select a Specialty</option>
//             {specialties.map((s) => (
//               <option key={s._id} value={s.name}>
//                 {s.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label><strong>Day of Week:</strong></label><br />
//           <select
//             value={dayOfWeek}
//             onChange={(e) => setDayOfWeek(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px' }}
//           >
//             <option value="">Select Day</option>
//             {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
//               <option key={d} value={d}>
//                 {d}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
//           {loading ? 'Checking...' : 'Check Availability'}
//         </button>
//       </form>

//       <div style={{ marginTop: '2rem' }}>
//         {doctors.length > 0 ? (
//           <div>
//             <h3>Available Doctors:</h3>
//             <ul>
//               {doctors.map((doc) => (
//                 <li key={doc._id}>
//                   <strong>{doc.userId?.name}</strong> ({doc.doctorType}) - {doc.userId?.email}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ) : (
//           !loading && <p>No doctors available for the selected time.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DoctorAvailabilityForm;
