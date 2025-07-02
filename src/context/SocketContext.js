// src/context/SocketContext.js
import React, { createContext, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

export const SocketContext = createContext();

const socket = io('http://localhost:8000', { withCredentials: true });

const SocketProvider = ({ children }) => {
  const toastDisplayedRef = useRef(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user?.id) {
      socket.emit('joinDoctorRoom', user.id);
    }

    const handleNewPatient = async (data) => {
      if (!toastDisplayedRef.current) {
        toastDisplayedRef.current = true;
        toast.success('🩺 New patient assigned waiting!');
        setTimeout(() => {
          toastDisplayedRef.current = false;
        }, 5000);
      }
    };

    socket.on('newAssignedPatient', handleNewPatient);

    return () => {
      socket.off('newAssignedPatient', handleNewPatient);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
