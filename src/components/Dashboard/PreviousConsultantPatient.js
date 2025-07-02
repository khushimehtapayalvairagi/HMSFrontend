import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PreviousConsultations = () => {
  const { patientId } = useParams(); // from the route
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
const user = JSON.parse(localStorage.getItem('user'));
const doctorId = user?.id;

// Filter consultations by logged-in doctor
// const filteredConsultations = consultations.filter(
//   (c) =>
//     String(c.doctorId?._id) === String(doctorId) &&
//     c.visitId?.status === "Completed" // ✅ filter only completed visits
// );



  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await axios.get(`http://localhost:8000/api/doctor/opd-consultations/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConsultations(res.data.consultations || []);
      } catch (err) {
        console.error('Error fetching consultations:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [patientId]);

  if (loading) return <p>Loading consultations...</p>;
  if (consultations.length === 0) return <p>No consultations found for this patient.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Previous OPD Consultations</h3>
  {consultations.map((c, index) => (
  <div key={c._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px' }}>
   
    <p><strong>Date:</strong> {new Date(c.consultationDateTime || c.createdAt).toLocaleString()}</p>
 
    <p><strong>Chief Complaint:</strong> {c.chiefComplaint}</p>
    <p><strong>Diagnosis:</strong> {c.diagnosis}</p>
    <p><strong>Doctor Notes:</strong> {c.doctorNotes}</p>
    <p><strong>Admission Advice:</strong> {c.admissionAdvice ? 'Yes' : 'No'}</p>
    <p><strong>Lab Investigations:</strong> {(c.labInvestigationsSuggested || []).join(', ')}</p>
    <p><strong>Medicines Prescribed:</strong> {c.medicinesPrescribedText}</p>
    {c.transcribedFromPaperNotes && (
      <p><strong>Transcribed By:</strong> {c.transcribedByUserId?.name || 'Unknown'} ({c.transcribedByUserId?.email})</p>
    )}
  </div>
))}
    </div>
  );
};

export default PreviousConsultations;
