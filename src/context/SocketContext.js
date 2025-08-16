import { useEffect } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { useAdmissionAdvice } from '../context/AdmissionAdviceContext';

const socket = io('http://localhost:8000', { withCredentials: true });

const SocketContext = () => {
  const { setAdviceData } = useAdmissionAdvice();

useEffect(() => {
  socket.emit('joinReceptionistRoom');

  socket.on('newIPDAdmissionAdvice', (data) => {
    toast.info(`Doctor advised admission for Patient ID: ${data.patientName}`);
    setAdviceData(data); // 🌟 store the socket data globally
  });

  return () => {
    socket.off('newIPDAdmissionAdvice');
  };
}, []);


  return null;
};

export default SocketContext;
