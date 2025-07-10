import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewAnesthesiaRecord = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllAnesthesiaRecords = async () => {
    const token = localStorage.getItem('jwt');
    try {
      // Step 1: Fetch all patients
      const patientRes = await axios.get(
        'http://localhost:8000/api/receptionist/patients',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const patients = patientRes.data.patients;

      // Step 2: For each patient, fetch their procedures
      const allProcedurePromises = patients.map(p =>
        axios
          .get(`http://localhost:8000/api/procedures/schedules/${p._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(res => res.data.procedures.map(proc => ({ ...proc, patient: p })))
          .catch(() => [])
      );

      const allProcedures = (await Promise.all(allProcedurePromises)).flat();

      // Step 3: Filter OT + Scheduled
      const filteredProcedures = allProcedures.filter(
        p =>  p.status === 'Scheduled'
      );

      // Step 4: For each, fetch anesthesia record
      const anesthesiaRecords = await Promise.all(
        filteredProcedures.map(p =>
          axios
            .get(`http://localhost:8000/api/procedures/anesthesia-records/${p._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => ({ ...res.data.record, procedureName: p.procedureId?.name || '', patient: p.patient }))
            .catch(() => null)
        )
      );

      const validRecords = anesthesiaRecords.filter(r => r !== null);
      setRecords(validRecords);
    } catch (error) {
      console.error('Error fetching anesthesia records:', error);
      toast.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAnesthesiaRecords();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
  }

  if (!records.length) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>No Anesthesia Records Found.</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h2>All Anesthesia Records (Scheduled OT Procedures)</h2>
      {records.map((record, index) => (
        <div
          key={record._id || index}
          style={{
            background: '#f0f8ff',
            marginBottom: '1rem',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <p><strong>Patient:</strong> {record.patient?.fullName || 'Unknown'}</p>
          <p><strong>Procedure:</strong> {record.procedureName || 'N/A'}</p>
          <p><strong>Anesthetist:</strong> {record.anestheticId?.userId?.name || 'N/A'}</p>
          <p><strong>Anesthesia Name:</strong> {record.anesthesiaName}</p>
          <p><strong>Type:</strong> {record.anesthesiaType}</p>
          <p><strong>Induce Time:</strong> {record.induceTime ? new Date(record.induceTime).toLocaleString() : 'N/A'}</p>
          <p><strong>End Time:</strong> {record.endTime ? new Date(record.endTime).toLocaleString() : 'N/A'}</p>
          <p><strong>Medicines Used:</strong> {record.medicinesUsedText || 'N/A'}</p>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default ViewAnesthesiaRecord;
