import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientVisitsViewer = () => {
  const [patientId, setPatientId] = useState('');
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVisits = async () => {
    if (!patientId.trim()) {
      toast.error('Please enter a Patient ID');
      return;
    }

    const token = localStorage.getItem('jwt');
    if (!token) {
      toast.error('Please login again');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/receptionist/visits/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVisits(res.data.visits || []);
    } catch (err) {
      console.error('Fetch visits error:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch visits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Patient Visits
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <Button variant="contained" onClick={fetchVisits} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Fetch Visits'}
        </Button>
      </Box>

      {visits.length > 0 ? (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Total Visits: {visits.length}
          </Typography>
          <List>
            {visits.map((visit) => (
             <Paper key={visit._id} sx={{ p: 2, mb: 2, fontWeight: 'bold' }} elevation={3}>

                <ListItem>
                  <ListItemText
                    primary={`Visit Type: ${visit.visitType}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>
                          <strong>Doctor:</strong>{' '}
                          {visit.assignedDoctorId?.fullName ||
                            visit.assignedDoctorId?.userId?.name ||
                            'N/A'}
                          <br />
                          <strong>Referred By:</strong> {visit.referredBy?.name || 'N/A'}
                          <br />
                          <strong>Date:</strong>{' '}
                          {new Date(visit.visitDate).toLocaleString()}
                          <br />
                          <strong>Status:</strong> {visit.status}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        </Box>
      ) : (
        !loading && <Typography>No visits found for this patient.</Typography>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default PatientVisitsViewer;
