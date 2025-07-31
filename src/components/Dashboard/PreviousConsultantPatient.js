import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PreviousConsultations = () => {
 const { patientId } = useParams();
  const [consultations, setConsultations] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [consultRes, admitRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/doctor/opd-consultations/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8000/api/ipd/admissions/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setConsultations(consultRes.data.consultations || []);
        setAdmissions(admitRes.data.admissions || []);
      } catch (err) {
        console.error("Error fetching records:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [patientId]);

  if (loading) return <p>Loading patient records...</p>;

  return (
    <div style={{ padding: '1rem' }}>
 <h3>📝 Previous OPD Consultations</h3>
{consultations.length === 0 ? (
  <p>No consultations found.</p>
) : consultations.map((c) => {
  // Find matching IPD admission for this consultation
  const matchingAdmission = admissions.find(a => {
    const consultDate = new Date(c.createdAt);
    const admitDate = new Date(a.createdAt);
    return Math.abs(consultDate - admitDate) < 1000 * 60 * 60 * 24 * 2; // within 2 days
  });

  return (
    <div key={c._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
      <p><strong>Date:</strong> {new Date(c.consultationDateTime || c.createdAt).toLocaleString()}</p>
      <p><strong>Complaint:</strong> {c.chiefComplaint}</p>
      <p><strong>Diagnosis:</strong> {c.diagnosis}</p>
      <p><strong>Notes:</strong> {c.doctorNotes}</p>
      <p><strong>Admission Advice:</strong> {c.admissionAdvice ? 'Yes' : 'No'}</p>
      <p><strong>Medicines:</strong> {c.medicinesPrescribedText}</p>
      {c.transcribedFromPaperNotes && (
        <p><strong>Transcribed By:</strong> {c.transcribedByUserId?.name || 'N/A'}</p>
      )}

      {matchingAdmission && (
        <div style={{ marginTop: '1rem', padding: '10px', backgroundColor: '#f0f8ff', border: '1px solid #aaa' }}>
          <h4>🏥 Related IPD Admission</h4>
          <p><strong>Admitted On:</strong> {new Date(matchingAdmission.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> {matchingAdmission.status}</p>
          <p><strong>Ward:</strong> {matchingAdmission.wardId?.name}</p>
          <p><strong>Bed Number:</strong> {matchingAdmission.bedNumber}</p>
          <p><strong>Room Category:</strong> {matchingAdmission.roomCategoryId?.name}</p>
          <p><strong>Expected Discharge:</strong> {matchingAdmission.expectedDischargeDate ? new Date(matchingAdmission.expectedDischargeDate).toLocaleDateString() : 'N/A'}</p>
          {matchingAdmission.actualDischargeDate && (
            <p><strong>Discharged On:</strong> {new Date(matchingAdmission.actualDischargeDate).toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  );
})}

    </div>
  );
};

export default PreviousConsultations;
