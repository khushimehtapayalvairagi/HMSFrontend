import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LabourRoomDetailViewer = () => {
  const { procedureScheduleId } = useParams(); // expects route like /labour-details/:procedureScheduleId
  const [detail, setDetail] = useState(null);
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/procedures/labour-details/${procedureScheduleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDetail(res.data.detail);
      } catch (err) {
        console.error("Error fetching labour room detail:", err);
        toast.error(err.response?.data?.message || "Failed to fetch labour details");
      }
    };

    if (procedureScheduleId) fetchDetail();
  }, [procedureScheduleId, token]);

  if (!detail) return <p>Loading labour room detail...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2>Labour Room Detail</h2>
      <p><strong>Baby Name:</strong> {detail.babyName || 'N/A'}</p>
      <p><strong>Gender:</strong> {detail.gender}</p>
      <p><strong>Date of Birth:</strong> {new Date(detail.dobBaby).toLocaleDateString()}</p>
      <p><strong>Time of Birth:</strong> {detail.timeOfBirth}</p>
      <p><strong>Weight:</strong> {detail.weight || 'N/A'}</p>
      <p><strong>Delivery Type:</strong> {detail.deliveryType}</p>
      <p><strong>Captured By:</strong> {detail.capturedByUserId?.name} ({detail.capturedByUserId?.email})</p>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LabourRoomDetailViewer;
