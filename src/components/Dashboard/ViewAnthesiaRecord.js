import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewAnesthesiaRecord = () => {
  const { procedureId } = useParams(); // from /anesthesia-view/:procedureId
  const [record, setRecord] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const res = await axios.get(
          `http://localhost:8000/api/procedures/anesthesia-records/${procedureId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecord(res.data.record);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch record');
      }
    };

    fetchRecord();
  }, [procedureId]);

  if (!record) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#f0f8ff', borderRadius: '10px' }}>
      <h2>Anesthesia Record</h2>
      <p><strong>Anesthetist:</strong> {record.anestheticId?.userId?.name || 'N/A'}</p>
      <p><strong>Anesthesia Name:</strong> {record.anesthesiaName}</p>
      <p><strong>Type:</strong> {record.anesthesiaType}</p>
      <p><strong>Induce Time:</strong> {record.induceTime ? new Date(record.induceTime).toLocaleString() : 'N/A'}</p>
      <p><strong>End Time:</strong> {record.endTime ? new Date(record.endTime).toLocaleString() : 'N/A'}</p>
      <p><strong>Medicines Used:</strong> {record.medicinesUsedText || 'N/A'}</p>
      <ToastContainer />
    </div>
  );
};

export default ViewAnesthesiaRecord;
