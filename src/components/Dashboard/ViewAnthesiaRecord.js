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
      const patientRes = await axios.get(
        'http://localhost:8000/api/receptionist/patients',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const patients = patientRes.data.patients;

      const allProcedurePromises = patients.map(p =>
        axios
          .get(`http://localhost:8000/api/procedures/schedules/${p._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(res => res.data.procedures.map(proc => ({ ...proc, patient: p })))
          .catch(() => [])
      );

      const allProcedures = (await Promise.all(allProcedurePromises)).flat();

      const filteredProcedures = allProcedures.filter(
        p => p.status === 'Scheduled'
      );

      const anesthesiaRecords = await Promise.all(
        filteredProcedures.map(p =>
          axios
            .get(`http://localhost:8000/api/procedures/anesthesia-records/${p._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => ({
              ...res.data.record,
              procedureName: p.procedureId?.name || '',
              patient: p.patient
            }))
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
    return <div style={styles.centerText}>Loading...</div>;
  }

  if (!records.length) {
    return <div style={styles.centerText}>No Anesthesia Records Found.</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Anesthesia Records</h2>
      {records.map((record, index) => (
        <div key={record._id || index} style={styles.card}>
          <p><strong>👤 Patient:</strong> {record.patient?.fullName || 'Unknown'}</p>
          <p><strong>🩺 Procedure:</strong> {record.procedureName || 'N/A'}</p>
          <p><strong>👨‍⚕️ Anesthetist:</strong> {record.anestheticId?.userId?.name || 'N/A'}</p>
          <p><strong>💉 Anesthesia:</strong> {record.anesthesiaName} ({record.anesthesiaType})</p>
          <p><strong>⏱️ Induce Time:</strong> {record.induceTime ? new Date(record.induceTime).toLocaleString() : 'N/A'}</p>
          <p><strong>✅ End Time:</strong> {record.endTime ? new Date(record.endTime).toLocaleString() : 'N/A'}</p>
          <p><strong>💊 Medicines Used:</strong> {record.medicinesUsedText || 'N/A'}</p>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default ViewAnesthesiaRecord;

// 🔧 Clean inline CSS
const styles = {
  container: {
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '1rem',
    fontFamily: 'Segoe UI, sans-serif'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#003366'
  },
  card: {
    background: '#e6f7ff',
    border: '1px solid #b3d8ff',
    marginBottom: '1.2rem',
    padding: '1rem 1.2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    lineHeight: '1.6',
    fontSize: '15px'
  },
  centerText: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '16px',
    color: '#555'
  }
};
