import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const OPDConsultationForm = () => {
  const location = useLocation();
  const { visitId } = useParams();  // 👈 get visitId from route
   const [visit, setVisit] = useState(location.state?.visit || null);
  const [loading, setLoading] = useState(true);

  // Form states...
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [admissionAdvice, setAdmissionAdvice] = useState(false);
  const [labInvestigationsSuggested, setLabInvestigationsSuggested] = useState('');
  const [medicinesPrescribedText, setMedicinesPrescribedText] = useState('');
  const [transcribedFromPaperNotes, setTranscribedFromPaperNotes] = useState(false);
  const [transcribedByUserId, setTranscribedByUserId] = useState('');
const navigate = useNavigate();

 

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('jwt');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!chiefComplaint) {
    toast.error('Chief Complaint is required.');
    return;
  }

  console.log(visit);

  const payload = {
    visitId: visit._id,
    patientId: visit.patientDbId._id,
 doctorId: visit.assignedDoctorUserId,


    chiefComplaint,
    diagnosis,
    doctorNotes,
    admissionAdvice,
    labInvestigationsSuggested: labInvestigationsSuggested.split(',').map(i => i.trim()),
    medicinesPrescribedText,
    transcribedFromPaperNotes,
    transcribedByUserId: transcribedFromPaperNotes ? user._id : undefined,
  };

  try {
    console.log("Payload being sent:", payload);

    await axios.post('http://localhost:8000/api/doctor/opd-consultations', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success('Consultation submitted successfully!');
    setTimeout(() => navigate('/doctor-dashboard'), 2000); // wait for toast to show
  } catch (err) {
    console.error(err.response?.data || err.message);
    toast.error(err.response?.data?.message || 'Failed to submit consultation.');
  }
};

  useEffect(() => {
  if (visit) {
    setLoading(false); // 👈 this fixes your issue
  }
}, [visit]);

  if (loading) return <p>Loading...</p>;
  if (!visit) return <p>Visit not found.</p>;

 return (
  <>
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: '1px solid #ccc',
        padding: '2rem',
        marginTop: '1rem',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <h3 style={{ textAlign: 'center' }}>OPD Consultation Details</h3>

      <div><strong>Patient ID:</strong> {visit.patientId}</div>
      <div><strong>Patient Name:</strong> {visit.patientDbId?.fullName || 'N/A'}</div>

      <textarea
        placeholder="Chief Complaint"
        value={chiefComplaint}
        onChange={(e) => setChiefComplaint(e.target.value)}
        required
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <textarea
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <textarea
        placeholder="Doctor Notes"
        value={doctorNotes}
        onChange={(e) => setDoctorNotes(e.target.value)}
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <label  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       Recommend IPD Admission
        <input
          type="checkbox"
          checked={admissionAdvice}
          onChange={(e) => setAdmissionAdvice(e.target.checked)}
        />
      
      </label>

      <input
        type="text"
        placeholder="Lab Investigations (comma separated)"
        value={labInvestigationsSuggested}
        onChange={(e) => setLabInvestigationsSuggested(e.target.value)}
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <textarea
        placeholder="Medicines Prescribed"
        value={medicinesPrescribedText}
        onChange={(e) => setMedicinesPrescribedText(e.target.value)}
        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

     <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <span>Transcribed from Paper Notes</span>
  <input
    type="checkbox"
    checked={transcribedFromPaperNotes}
    onChange={(e) => setTranscribedFromPaperNotes(e.target.checked)}
  />
</label>

      {transcribedFromPaperNotes && (
        <input
          type="text"
          placeholder="Transcribed By User ID"
          value={transcribedByUserId}
          onChange={(e) => setTranscribedByUserId(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Print
        </button>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit Consultation
        </button>
      </div>
    </form>

    <ToastContainer position="top-right" autoClose={3000} />
  </>
);


};

export default OPDConsultationForm;
