// import { useLocation, useNavigate } from 'react-router-dom';
// import { useEffect, useState, useRef } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';

// const DailyReports = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const token = localStorage.getItem('jwt');
//   const user = JSON.parse(localStorage.getItem('user'));

//   const { ipdAdmissionId, patientId } = location.state || {};
//   const [reportSaved, setReportSaved] = useState(false);
//   const [vitals, setVitals] = useState({ temperature: '', pulse: '', bp: '', respiratoryRate: '' });
//   const [nurseNotes, setNurseNotes] = useState('');
//   const [treatments, setTreatments] = useState('');
//   const [medicine, setMedicine] = useState('');
//   const BASE_URL = process.env.REACT_APP_BASE_URL;

//   const printRef = useRef();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setVitals((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         `${BASE_URL}/api/ipd/reports`,
//         {
//           ipdAdmissionId,
//           recordedByUserId: user.id,
//           vitals,
//           nurseNotes,
//           treatmentsAdministeredText: treatments,
//           medicineConsumptionText: medicine
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success('Report saved successfully!');
//       setReportSaved(true);
//     } catch (err) {
//       console.error(err);
//       toast.error('Error saving report');
//     }
//   };

//   // ✅ Print only blank form
//    // ✅ Print only blank form with hospital heading
//   const handlePrint = () => {
//     const WinPrint = window.open('', '', 'width=900,height=650');
//     WinPrint.document.write('<html><head><title>Daily Report (Blank)</title>');
//     WinPrint.document.write('<style>');
//     WinPrint.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
//     WinPrint.document.write('h2, h3, h4, h6 { text-align: center; margin: 4px 0; }');
//     WinPrint.document.write('fieldset { margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; }');
//     WinPrint.document.write('label { display: block; margin-bottom: 8px; }');
//     WinPrint.document.write('input, textarea { width: 100%; border: 1px solid #aaa; padding: 6px; margin-top: 4px; }');
//     WinPrint.document.write('textarea { height: 60px; }');
//     WinPrint.document.write('</style></head><body>');

//     // ✅ Hospital Heading
//     WinPrint.document.write(`
//       <div style="text-align:center;">
//         <h3>Anjuman-I-Islam's</h3>
//         <h4>Dr. M.I. Jamkhanawala Tibbia Unani Medical College & Hospital</h4>
//         <h4>Haji Abdul Razzak Kalsekar Tibbia Hospital</h4>
//         <h6>Anjuman-I-Islam Complex, Yari Road, Versova, Andheri(W), Mumbai 400 061.</h6>
//       </div>
//       <hr/>
//       <h2>Daily Progress Report </h2>
//     `);

//     // ✅ Blank form fields
//     WinPrint.document.write(`
//       <fieldset>
//         <legend><strong>Vitals</strong></legend>
//         <label>Temperature: <input type="text" /></label>
//         <label>Pulse: <input type="text" /></label>
//         <label>BP: <input type="text" /></label>
//         <label>Respiratory Rate: <input type="text" /></label>
//       </fieldset>

//       <label>Nurse Notes: <textarea></textarea></label>
//       <label>Treatments Administered: <textarea></textarea></label>
//       <label>Medicine Consumption: <textarea></textarea></label>
//     `);

//     WinPrint.document.write('</body></html>');
//     WinPrint.document.close();
//     WinPrint.focus();
//     WinPrint.print();
//     WinPrint.close();
//   };


//   const containerStyle = {
//     maxWidth: '600px',
//     margin: '2rem auto',
//     padding: '2rem',
//     border: '1px solid #ccc',
//     borderRadius: '10px',
//     backgroundColor: '#f9f9f9',
//     fontFamily: 'Arial, sans-serif',
//   };

//   const sectionStyle = { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' };
//   const labelStyle = { display: 'flex', flexDirection: 'column', fontSize: '14px' };
//   const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #aaa', marginTop: '4px' };
//   const textareaStyle = { ...inputStyle, height: '80px', resize: 'vertical' };
//   const buttonStyle = { padding: '10px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginRight: '1rem' };

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <form onSubmit={handleSubmit} style={containerStyle} ref={printRef}>
//         <h2>Daily Progress Report</h2>

//         <fieldset style={{ ...sectionStyle, border: '1px solid #ccc', padding: '1rem' }}>
//           <legend><strong>Vitals</strong></legend>
//           <label style={labelStyle}>Temperature: <input name="temperature" value={vitals.temperature} onChange={handleChange} type="number" step="0.1" style={inputStyle} /></label>
//           <label style={labelStyle}>Pulse: <input name="pulse" value={vitals.pulse} onChange={handleChange} type="number" style={inputStyle} /></label>
//           <label style={labelStyle}>BP: <input name="bp" value={vitals.bp} onChange={handleChange} placeholder="e.g. 120/80" style={inputStyle} /></label>
//           <label style={labelStyle}>Respiratory Rate: <input name="respiratoryRate" value={vitals.respiratoryRate} onChange={handleChange} type="number" style={inputStyle} /></label>
//         </fieldset>

//         <div style={sectionStyle}>
//           <label style={labelStyle}>Nurse Notes: <textarea value={nurseNotes} onChange={(e) => setNurseNotes(e.target.value)} style={textareaStyle} /></label>
//           <label style={labelStyle}>Treatments Administered: <textarea value={treatments} onChange={(e) => setTreatments(e.target.value)} style={textareaStyle} /></label>
//           <label style={labelStyle}>Medicine Consumption: <textarea value={medicine} onChange={(e) => setMedicine(e.target.value)} style={textareaStyle} /></label>
//         </div>

//         <div style={{ display: 'flex', justifyContent: 'center' }}>
//           <button type="submit" style={buttonStyle}>Save Report</button>
      
//             <>
//               {/* <button type="button" onClick={() => navigate('/nurse-dashboard/ViewDailyReports', { state: { ipdAdmissionId } })} style={{ ...buttonStyle, backgroundColor: '#28a745' }}>View Reports</button> */}
//               <button type="button" onClick={handlePrint} style={{ ...buttonStyle, backgroundColor: '#6c757d' }}>Print Blank</button>
//             </>
          
//         </div>
//       </form>
//     </>
//   );
// };

// export default DailyReports;
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const DailyReports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const user = JSON.parse(localStorage.getItem('user'));

  const { ipdAdmissionId, patientId } = location.state || {};
  const [reportSaved, setReportSaved] = useState(false);
  const [vitals, setVitals] = useState({ temperature: '', pulse: '', bp: '', respiratoryRate: '' });
  const [nurseNotes, setNurseNotes] = useState('');
  const [treatments, setTreatments] = useState('');
  const [medicine, setMedicine] = useState('');
const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVitals((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}/api/ipd/reports`,
        {
          ipdAdmissionId,
         recordedByUserId:  user.id,

          vitals,
          nurseNotes,
          treatmentsAdministeredText: treatments,
          medicineConsumptionText: medicine
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Report saved successfully!');
      setReportSaved(true);
    } catch (err) {
      console.error(err);
      toast.error('Error saving report');
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
  };

  const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  };

  const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #aaa',
    marginTop: '4px',
  };

  const textareaStyle = {
    ...inputStyle,
    height: '80px',
    resize: 'vertical',
  };

  const buttonStyle = {
    padding: '10px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: '1rem',
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={handleSubmit} style={containerStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Daily Progress Report</h2>

        <fieldset style={{ ...sectionStyle, border: '1px solid #ccc', padding: '1rem' }}>
          <legend><strong>Vitals</strong></legend>
          <label style={labelStyle}>
            Temperature:
            <input name="temperature" value={vitals.temperature} onChange={handleChange} type="number" step="0.1" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Pulse:
            <input name="pulse" value={vitals.pulse} onChange={handleChange} type="number" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            BP:
            <input name="bp" value={vitals.bp} onChange={handleChange} placeholder="e.g. 120/80" style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Respiratory Rate:
            <input name="respiratoryRate" value={vitals.respiratoryRate} onChange={handleChange} type="number" style={inputStyle} />
          </label>
        </fieldset>

        <div style={sectionStyle}>
          <label style={labelStyle}>
            Nurse Notes:
            <textarea value={nurseNotes} onChange={(e) => setNurseNotes(e.target.value)} style={textareaStyle} />
          </label>

          <label style={labelStyle}>
            Treatments Administered:
            <textarea value={treatments} onChange={(e) => setTreatments(e.target.value)} style={textareaStyle} />
          </label>

          <label style={labelStyle}>
            Medicine Consumption:
            <textarea value={medicine} onChange={(e) => setMedicine(e.target.value)} style={textareaStyle} />
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button type="submit" style={buttonStyle}>Save Report</button>
          {reportSaved && (
            <button
              type="button"
              onClick={() => navigate('/nurse-dashboard/ViewDailyReports', { state: { ipdAdmissionId } })}
              style={{ ...buttonStyle, backgroundColor: '#28a745' }}
            >
              View Reports
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default DailyReports;
