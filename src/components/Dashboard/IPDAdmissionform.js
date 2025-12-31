// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useAdmissionAdvice } from '../../context/AdmissionAdviceContext';

// const IPDAdmissionForm = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('jwt');
//   const { adviceData, setAdviceData } = useAdmissionAdvice();
//   const printRef = useRef();
// const [admittedOn, setAdmittedOn] = useState('');
//   // Pre-filled state
//  const [patientDbId, setPatientDbId] = useState(adviceData?.patientDbId || '');
// const [patientRegNo, setPatientRegNo] = useState(adviceData?.patientRegNo || ''); // for display
// const [patientName, setPatientName] = useState(adviceData?.patientName || '');

//   const [admittingDoctorId, setAdmittingDoctorId] = useState(adviceData?.admittingDoctorId || '');
//   const [doctorName, setDoctorName] = useState(adviceData?.doctorName || '');
//   const [wardId, setWardId] = useState('');
//   const [bedNumber, setBedNumber] = useState('');
//   const [roomCategoryId, setRoomCategoryId] = useState('');
//   const [expectedDischargeDate, setExpectedDischargeDate] = useState('');
//   const [submitted, setSubmitted] = useState(false);

//   const [wards, setWards] = useState([]);
//   const [roomCategories, setRoomCategories] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [allPatients, setAllPatients] = useState([]);
//   const [admissionData, setAdmissionData] = useState(null);

//   const BASE_URL = process.env.REACT_APP_BASE_URL ;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [wardsRes, roomRes, docRes, patientRes] = await Promise.all([
//           axios.get(`${BASE_URL}/api/receptionist/wards`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${BASE_URL}/api/receptionist/room-categories`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${BASE_URL}/api/receptionist/doctors-available`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${BASE_URL}/api/receptionist/patients`, { headers: { Authorization: `Bearer ${token}` } }),
//         ]);

//         setWards(wardsRes.data.wards || []);
//         setRoomCategories(roomRes.data.roomCategories || []);
//         setDoctors(docRes.data.doctors || []);
//         setAllPatients(patientRes.data.patients || []);
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to load data.');
//       }
//     };
//     fetchData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!patientDbId || !admittingDoctorId || !wardId || !bedNumber || !roomCategoryId) {
//       return toast.error('All required fields must be filled.');
//     }

//     const payload = {
//       patientId: patientDbId,
//       wardId,
//       bedNumber,
//       roomCategoryId,
//       admittingDoctorId,
//       expectedDischargeDate,
//     };

//     try {
//       const res = await axios.post(`${BASE_URL}/api/ipd/admissions`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAdmissionData(res.data.admission);
//           setAdmittedOn(new Date().toLocaleDateString());
//       setSubmitted(true);
//       setTimeout(() => handlePrint(), 500);
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       toast.error(err.response?.data?.message || 'IPD Admission failed.');
//     }
//   };

//   const handleCancel = () => {
//     setPatientDbId('');
//     setPatientName('');
//     setAdmittingDoctorId('');
//     setDoctorName('');
//     setWardId('');
//     setBedNumber('');
//     setRoomCategoryId('');
//     setExpectedDischargeDate('');
//     setSubmitted(false);
//     setAdviceData(null);
//     toast.info('Admission form reset.');
//   };

//   const handlePrint = () => {
//     if (!printRef.current) return;
//     const content = printRef.current.innerHTML;
//     const printWindow = window.open('', '', 'width=800,height=600');
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Admission Form</title>
//           <style>
//             body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; margin: 0; padding: 20px; }
//             .admission-form-container { width: 100%; border: 1px solid black; padding: 10px; box-sizing: border-box; }
//             .header { text-align: center; margin-bottom: 20px; font-weight: bold; }
//             .header h3, .header p { margin: 0; line-height: 1.2; }
//             .form-title { text-align: center; border-bottom: 2px solid black; padding-bottom: 5px; margin: 10px 0; font-size: 18pt; font-weight: bold; }
//             .section-heading { font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; text-decoration: underline; }
//             .field-row { display: flex; flex-wrap: wrap; margin-bottom: 8px; }
//             .field { flex: 1; min-width: 150px; margin-right: 15px; display: flex; align-items: baseline; }
//             .field label { font-weight: bold; margin-right: 5px; white-space: nowrap; }
//             .field span { border-bottom: 1px dashed black; flex-grow: 1; padding: 2px 0; }
//             .field-full { flex: 100%; }
//             .triple-field { flex: 3; margin-right: 15px; }
//             .signature-section { display: flex; justify-content: space-between; margin-top: 50px; }
//             .signature-box { flex: 1; text-align: center; margin: 0 20px; }
//             .signature-line { border-top: 1px solid black; margin-top: 30px; }
//             .consent { border: 1px solid black; padding: 10px; margin-top: 20px; font-style: italic; font-size: 10pt; }
//           </style>
//         </head>
//         <body>${content}</body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   const getNameParts = (fullName) => {
//     if (!fullName) return { surname: '', firstName: '', middleName: '' };
//     const parts = fullName.trim().split(' ');
//     const surname = parts.length > 1 ? parts[parts.length - 1] : '';
//     const firstName = parts.length > 0 ? parts[0] : '';
//     const middleName = parts.length > 2 ? parts.slice(1, -1).join(' ') : '';
//     return { surname, firstName, middleName };
//   };

//   const patientNameParts = getNameParts(patientName);

//   return (
//     <div style={{ maxWidth: 600, margin: '2rem auto' }}>
//       <ToastContainer />
//       {!submitted ? (
//         <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
//           <h2>IPD Admission</h2>

//           <div>
//             <label>Patient:</label>
//             <select
//               value={patientDbId}
//               onChange={(e) => {
//                 const selectedPatient = allPatients.find(p => p._id === e.target.value);
//                 setPatientDbId(selectedPatient?._id || '');
//                setPatientRegNo(selectedPatient?.patientId || ''); 
//                 setPatientName(selectedPatient?.fullName || '');
                 
//               }}
//               required
//             >
//               <option value="">Select Patient</option>
//               {allPatients.filter(p => p.status?.toLowerCase() !== 'discharged').map(p => (
//                 <option key={p._id} value={p._id}>{p.patientId} - {p.fullName}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label>Doctor:</label>
//             <select
//               value={admittingDoctorId}
//               onChange={(e) => {
//                 const selectedDoc = doctors.find(d => d._id === e.target.value);
//                 setAdmittingDoctorId(selectedDoc?._id || '');
//                 setDoctorName(selectedDoc?.userId?.name || '');
//               }}
//               required
//             >
//               <option value="">Select Doctor</option>
//               {doctors.map(d => (
//                 <option key={d._id} value={d._id}>{d.userId?.name} ({d.doctorType})</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label>Ward:</label>
//             <select value={wardId} onChange={e => setWardId(e.target.value)} required>
//               <option value="">Select Ward</option>
//               {wards.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
//             </select>
//           </div>

//           <div>
//             <label>Bed Number:</label>
//             <input value={bedNumber} onChange={e => setBedNumber(e.target.value)} required />
//           </div>

//           <div>
//             <label>Room Category:</label>
//             <select value={roomCategoryId} onChange={e => setRoomCategoryId(e.target.value)} required>
//               <option value="">Select Category</option>
//               {roomCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//             </select>
//           </div>

//           <div>
//             <label>Expected Discharge:</label>
//             <input type="date" value={expectedDischargeDate} onChange={e => setExpectedDischargeDate(e.target.value)} />
//           </div>

//           <div style={{ marginTop: 15, display: 'flex', gap: '1rem' }}>
//             <button type="submit" style={{ flex: 1, backgroundColor: '#1976d2', color: 'white', padding: '0.5rem', border: 'none', borderRadius: 4 }}>Admit</button>
//             <button type="button" onClick={handleCancel} style={{ flex: 1, backgroundColor: '#9e9e9e', color: 'white', padding: '0.5rem', border: 'none', borderRadius: 4 }}>Cancel</button>
//           </div>
//         </form>
//       ) : (
//         <div style={{ textAlign: 'center' }}>
//           <h2>✅ Admission Successful</h2>
//       <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: '10px' }}>
//   <button onClick={handlePrint} style={{ padding: '0.5rem 1rem' }}>
//     🖨️ Print Admission Form
//   </button>
//   <button 
//     onClick={() => navigate(`/receptionist-dashboard/IPDAdmissionList/${patientDbId}`, {
//       state: { patientName }
//     })}
//     style={{ padding: '0.5rem 1rem', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: 4 }}
//   >
//     📋 View Admissions
//   </button>
// </div>


//           <div ref={printRef} style={{ position: 'absolute', left: '-9999px', top: 0 }}>
//             <div className="admission-form-container">
//               <div className="header">
//                 <h3>Anjuman-I-Islam's</h3>
//                 <h3>Dr. M. I. Jamkhanawala Tibbia Unani Medical College &</h3>
//                 <h3>Haji Abdul Razzak Kalsekar Tibiya Hospital</h3>
//                 <p>Anjuman-I-Islam Complex, Yari Road, Versova, Andheri(W), Mumbai 400 061.</p>
//                 <p>Telefax: 26351188, Tel.: 26351199</p>
//               </div>
//               <h1 className="form-title">Admission Form</h1>

//               <div className="section">
//                 <div className="field-row">
//                  <div className="field triple-field"><label>Reg. No.:</label><span>{patientRegNo}</span></div>
// <div className="field triple-field"><label>Admitted On:</label><span>{admittedOn}</span></div>

//                   <div className="field triple-field"><label>Bed No.:</label><span>{bedNumber}</span></div>
//                   <div className="field triple-field"><label>Class:</label><span>{roomCategories.find(c => c._id === roomCategoryId)?.name || ''}</span></div>
//                 </div>
//                 <div className="field-row">
//                   <div className="field triple-field"><label>Admitted Under Dr.:</label><span>{doctorName}</span></div>
//                   <div className="field triple-field"><label>Expected Discharge:</label><span>{expectedDischargeDate}</span></div>
//                 </div>
//                 <div className="field-row">
//                   <div className="field triple-field"><label>SURNAME:</label><span>{patientNameParts.surname}</span></div>
//                   <div className="field triple-field"><label>FIRST NAME:</label><span>{patientNameParts.firstName}</span></div>
//                   <div className="field triple-field"><label>MIDDLE NAME:</label><span>{patientNameParts.middleName}</span></div>
//                 </div>
//                                 <div className="section">
//       {/* 💰 Deposits Section */}
//       <div className="field-row">
//         <div className="field triple-field">
//           <label>Deposits Receipt No.:</label>
//           <span></span>
//         </div>
//         <div className="field triple-field">
//           <label>Date:</label>
//           <span></span>
//         </div>
//         <div className="field triple-field">
//           <label>Cashier Sign:</label>
//           <span></span>
//         </div>
//         <div className="field triple-field">
//           <label>Amount:</label>
//           <span></span>
//         </div>
//       </div>
//       <div className="field-row">
//         <div className="field triple-field">
//           <label>Deposits Receipt No.:</label>
//           <span></span>
//         </div>
//         <div className="field triple-field">
//           <label>Date:</label>
//           <span></span>
//         </div>
//         <div className="field triple-field">
//           <label>Cashier Sign:</label>
//           <span></span>
//         </div>
//         <div className="field triple-field">
//           <label>Amount:</label>
//           <span></span>
//         </div>
//       </div>
//       <div className="field-row">
//         <div className="field triple-field">
//           <label>Deposits Receipt No.:</label>
//           <span></span>
//         </div>
//         <div className="field triple-field">
//           <label>Date:</label>
//           <span></span>
//         </div>
//         <div className="field triple-field">
//           <label>Cashier Sign:</label>
//           <span></span>
//         </div>
//         <div className="field triple-field">
//           <label>Amount:</label>
//           <span></span>
//         </div>
//       </div>
//       {/* 💰 End of Deposits Section */}
//     </div>
//                 {/* Transferred Details */}
//                 <div className="section-heading">Transferred Details</div>
//                 <div className="field-row">
//                   <div className="field triple-field"><label>From Ward:</label><span>{admissionData?.fromWard || ''}</span></div>
//                   <div className="field triple-field"><label>From Bed No.:</label><span>{admissionData?.fromBed || ''}</span></div>
//                 </div>

//                 {/* Discharge Section */}
//                 <div className="section-heading">Discharge</div>
//                 <div className="field-row">
//                   <div className="field triple-field"><label>Date:</label><span>{admissionData?.dischargeDate || ''}</span></div>
//                   <div className="field triple-field"><label>Condition:</label><span>{admissionData?.dischargeCondition || ''}</span></div>
//                 </div>

//                 {/* Next of Kin */}
//                 <div className="section-heading">Next of Kin</div>
//                 <div className="field-row">
//                   <div className="field triple-field"><label>Name:</label><span>{admissionData?.nokName || ''}</span></div>
//                   <div className="field triple-field"><label>Relationship:</label><span>{admissionData?.nokRelationship || ''}</span></div>
//                   <div className="field triple-field"><label>Contact:</label><span>{admissionData?.nokContact || ''}</span></div>
//                 </div>

//                 {/* Consent */}
//                 <div className="consent">
//                   Consent:i have been explained the needs , nature,complications & consequence of admission/surgery....................................in a language understood by me.
//                   I hereby give my consent for admission and treatment.
//                 </div>

//                 {/* Signatures */}
//                 <div className="signature-section">
//                   <div className="signature-box">
//                     <div className="signature-line"></div>
//                     Patient / Relative
//                   </div>
//                   <div className="signature-box">
//                     <div className="signature-line"></div>
//                     Doctor
//                   </div>
//                   <div className="signature-box">
//                     <div className="signature-line"></div>
//                     Witness
//                   </div>
//                 </div>
//               </div>
//             </div>
         
         
         
         
         
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default IPDAdmissionForm;
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import io from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";
import { useAdmissionAdvice } from "../../context/AdmissionAdviceContext";

const socket = io(process.env.REACT_APP_BASE_URL, {
  withCredentials: true,
});

const IPDAdmissionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("jwt");
  const { adviceData } = useAdmissionAdvice();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const patient = location.state?.patient || null;
  const visit = location.state?.visit || null;

  const initialPatientId = adviceData?.patientDbId || patient?._id || "";
  const initialVisitId = adviceData?.visitId || visit?._id || "";
  const initialAdmittingDoctorId =
    adviceData?.admittingDoctorId || visit?.assignedDoctorId || "";

  const [patientId, setPatientId] = useState(initialPatientId);
  const [visitId, setVisitId] = useState(initialVisitId);
  const [admittingDoctorId, setAdmittingDoctorId] = useState(
    initialAdmittingDoctorId
  );
  const [patientName, setPatientName] = useState(
    adviceData?.patientName || patient?.name || visit?.patientName || ""
  );
  const [doctorName, setDoctorName] = useState(visit?.doctorName || "");

  const [submitted, setSubmitted] = useState(false);

  const [wards, setWards] = useState([]);
  const [roomCategories, setRoomCategories] = useState([]);

  const [wardId, setWardId] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [roomCategoryId, setRoomCategoryId] = useState("");
  const [expectedDischargeDate, setExpectedDischargeDate] = useState("");

  const [admissionData, setAdmissionData] = useState(null);
  const [admittedOn, setAdmittedOn] = useState("");

  const printRef = useRef();

  // 🔄 fetch wards + categories
  useEffect(() => {
    fetchWards();
    fetchRoomCategories();

    socket.emit("joinReceptionistRoom");
    socket.on("newIPDAdmissionAdvice", (data) => {
      toast.info(`Doctor advised admission for Patient ID: ${data.patientId}`);
      setPatientId(data.patientId || "");
      setVisitId(data.visitId || "");
      setAdmittingDoctorId(data.admittingDoctorId || data.doctorId || "");
      setPatientName(data.patientName || "");
      setDoctorName(data.doctorName || "");
    });

    return () => {
      socket.off("newIPDAdmissionAdvice");
    };
  }, []);

  const fetchWards = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/receptionist/wards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWards(res.data.wards || []);
    } catch (err) {
      toast.error("Failed to load wards");
    }
  };

  const fetchRoomCategories = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/receptionist/room-categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoomCategories(res.data.roomCategories || []);
    } catch (err) {
      toast.error("Failed to load room categories");
    }
  };

  // ✔ submit admission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !patientId ||
      !visitId ||
      !wardId ||
      !bedNumber ||
      !roomCategoryId ||
      !admittingDoctorId
    ) {
      return toast.error("All required fields must be filled.");
    }

    const payload = {
      patientId,
      visitId,
      wardId,
      bedNumber: Number(bedNumber),
      roomCategoryId,
      admittingDoctorId,
      expectedDischargeDate,
    };

    try {
      const res = await axios.post(`${BASE_URL}/api/ipd/admissions`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmissionData(res.data.admission || res.data);
      setAdmittedOn(new Date().toLocaleDateString());
      toast.success("IPD Admission successful!");
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "IPD Admission failed.");
    }
  };

  // 💡 break name into parts
  const getNameParts = (fullName) => {
    if (!fullName) return { surname: "", firstName: "", middleName: "" };
    const parts = fullName.trim().split(" ");
    return {
      surname: parts[parts.length - 1] || "",
      firstName: parts[0] || "",
      middleName: parts.slice(1, -1).join(" ") || "",
    };
  };
  const patientNameParts = getNameParts(patientName);

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <ToastContainer />

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          style={{ padding: "2rem", border: "1px solid #ccc", borderRadius: 8 }}
        >
          <h2>IPD Admission</h2>

          <div>
            <label>Patient</label>
            <input readOnly value={patientName} />
          </div>

          <div>
            <label>Doctor</label>
            <input readOnly value={doctorName} />
          </div>

          <div>
            <label>Ward</label>
            <select
              value={wardId}
              onChange={(e) => {
                setWardId(e.target.value);
                setBedNumber("");
              }}
            >
              <option value="">Select Ward</option>
              {wards.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Bed Number</label>
            <select
              value={bedNumber}
              onChange={(e) => setBedNumber(e.target.value)}
              disabled={!wardId}
            >
              <option value="">Select bed</option>
              {wards
                .find((w) => w._id === wardId)
                ?.beds.map((b) => (
                  <option
                    key={`${b.bedNumber}`}
                    value={b.bedNumber}
                    disabled={b.status !== "available"}
                  >
                    Bed {b.bedNumber} — {b.status}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label>Room Category</label>
            <select
              value={roomCategoryId}
              onChange={(e) => setRoomCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {roomCategories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>Expected Discharge Date</label>
            <input
              type="date"
              value={expectedDischargeDate}
              onChange={(e) => setExpectedDischargeDate(e.target.value)}
            />
          </div>

          <button type="submit" style={{ marginTop: "1rem" }}>
            Admit
          </button>
        </form>
      ) : (
        <div>
          <h3>Admission Completed!</h3>
        </div>
      )}
    </div>
  );
};

export default IPDAdmissionForm;

