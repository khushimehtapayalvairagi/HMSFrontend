import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
  Container,
  Paper,
  Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io(process.env.REACT_APP_BASE_URL, {
  withCredentials: true,
});

const DoctorDashboardHome = () => {
  const [assignedVisits, setAssignedVisits] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();
  const toastDisplayedRef = useRef(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const doctorRef = useRef(null);
  const tokenRef = useRef(null);
const socketInitialized = useRef(false);
useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('jwt');
  console.log(storedUser);
  if (storedUser && token) {
    setDoctor(storedUser);
    doctorRef.current = storedUser;
    tokenRef.current = token;
  }
}, []);


  
const fetchVisits = async () => {
  const token = tokenRef.current;
  const doctorId = doctorRef.current?.id;
  // console.log("Raghav: ", doctorId);
  if (!doctorId || !token) {
    console.warn("Missing doctorId or token");
    return;
  }

  try {
    const res = await axios.get(
      `${BASE_URL}/api/doctor/visits/doctor/${doctorId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    // console.log(res.data.visits);
    setAssignedVisits(res.data.visits || []);
  } catch (err) {
    console.error('Error fetching assigned visits:', err.response?.data || err);
  }
};



  useEffect(() => {
    if (!doctor) return;
const socket = io(process.env.REACT_APP_BASE_URL, {
  withCredentials: true,
});
  const doctorId = doctor.id;
  console.log(doctorId);
  doctorRef.current = doctor;
  tokenRef.current = localStorage.getItem('jwt');

   socket.emit('joinDoctorRoom', doctorId); // ✅ emit to server to join the room

  console.log('Joined doctor room:', doctorId);

  if (!socketInitialized.current) {
    socket.on('newAssignedPatient', async (data) => {
      console.log(data);
      if (data.doctorId === doctorRef.current?.id) {
        await fetchVisits();
        toast.success(`🩺 New patient assigned: ${data.patientName || 'Patient'}`);
      }
    });

      socketInitialized.current = true;
    }

    fetchVisits();

    return () => {
      socket.off('newAssignedPatient');
      socketInitialized.current = false;
    };
  }, [doctor]);

  const waitingVisits = assignedVisits.filter(visit => visit.status === 'Waiting');

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome Dr. {doctor?.name}
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Assigned Patients
      </Typography>

      {waitingVisits.length === 0 ? (
        <Typography>No assigned patients at the moment.</Typography>
      ) : (
        waitingVisits.map((visit, index) => {
          const isEven = index % 2 === 0;
          const backgroundColor = isEven ? '#e3f2fd' : '#e8f5e9'; // light blue and light green
          const borderColor = isEven ? '#9c27b0' : '#2e7d32'; // purple and green

          return (
            <Accordion
              key={visit._id}
              sx={{
                mb: 2,
                backgroundColor,
                borderLeft: `6px solid ${borderColor}`,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {index + 1}. {visit.patientDbId?.fullName || 'Unnamed Patient'}-{"new patient"}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography><strong>Patient ID:</strong> {visit.patientId}</Typography>
                  <Typography><strong>Status:</strong> {visit.status}</Typography>

                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        navigate(`/doctor-dashboard/ConsultationForm/${visit._id}`, {
                          state: { visit },
                        })
                      }
                    >
                      Start Consultation
                    </Button>

                    {visit.patientDbId?._id && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() =>
                          navigate(`/doctor-dashboard/PreviousConsultantPatient/${visit.patientDbId._id}`)
                        }
                      >
                        View Previous Consultations
                      </Button>
                    )}
                  </Stack>
                </Paper>
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
 <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default DoctorDashboardHome;
