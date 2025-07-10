import { useLocation } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const DailyReports = () => {
  const location = useLocation();
  const token = localStorage.getItem('jwt');
  const user = JSON.parse(localStorage.getItem('user'));
 // Save this on login
   const [reportSaved, setReportSaved] = useState(false);

  const { ipdAdmissionId, patientId } = location.state || {};
  const [vitals, setVitals] = useState({ temperature: '', pulse: '', bp: '', respiratoryRate: '' });
  const [nurseNotes, setNurseNotes] = useState('');
  const [treatments, setTreatments] = useState('');
  const [medicine, setMedicine] = useState('');
const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVitals((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ ipdAdmissionId, recordedByUserId: user?.id });

    try {
      await axios.post(
                  `http://localhost:8000/api/ipd/reports`,
        {
          ipdAdmissionId,
          recordedByUserId:user.id,
          vitals,
          nurseNotes,
          treatmentsAdministeredText: treatments,
          medicineConsumptionText: medicine
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(' Report saved successfully!');
      setReportSaved(true);
   
    } catch (err) {
      console.error(err);
         toast.error(' Error saving report');
    }
  };

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
       <form onSubmit={handleSubmit}>
      <h2>Daily Progress Report</h2>

      <fieldset>
        <legend>Vitals</legend>
        <label>
          Temperature:
          <input name="temperature" value={vitals.temperature} onChange={handleChange} type="number" step="0.1" />
        </label>
        <label>
          Pulse:
          <input name="pulse" value={vitals.pulse} onChange={handleChange} type="number" />
        </label>
        <label>
          BP:
          <input name="bp" value={vitals.bp} onChange={handleChange} placeholder="e.g. 120/80" />
        </label>
        <label>
          Respiratory Rate:
          <input name="respiratoryRate" value={vitals.respiratoryRate} onChange={handleChange} type="number" />
        </label>
      </fieldset>

      <label>
        Nurse Notes:
        <textarea value={nurseNotes} onChange={(e) => setNurseNotes(e.target.value)} />
      </label>

      <label>
        Treatments Administered:
        <textarea value={treatments} onChange={(e) => setTreatments(e.target.value)} />
      </label>

      <label>
        Medicine Consumption:
        <textarea value={medicine} onChange={(e) => setMedicine(e.target.value)} />
      </label>

      <button type="submit">Save Report</button>
     {reportSaved && (
  <button
    type="button"
    onClick={() =>
      navigate('/nurse-dashboard/ViewDailyReports', {
        state: { ipdAdmissionId },
      })
    }
    style={{
      marginLeft: '1rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
    }}
  >
    View Reports
  </button>
)}

    </form>
    </>

 
  );
};

export default DailyReports;
