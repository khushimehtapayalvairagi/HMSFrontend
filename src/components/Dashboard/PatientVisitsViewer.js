import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientVisitsViewer = () => {
  const [patientId, setPatientId] = useState('');
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
const BASE_URL = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    if (patientId.trim() === '') {
      setVisits([]);
    }
  }, [patientId]);

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
      const res = await axios.get(`${BASE_URL}/api/receptionist/visits/${patientId}`, {
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Patient Visits
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') fetchVisits();
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={fetchVisits} disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : <SearchIcon />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {visits.length > 0 ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Total Visits: {visits.length}
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Visit Type</strong></TableCell>
                  <TableCell><strong>Doctor</strong></TableCell>
                  <TableCell><strong>Referred By</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow key={visit._id}>
                    <TableCell>{visit.visitType}</TableCell>
                    <TableCell>
                      {visit.assignedDoctorId?.fullName ||
                        visit.assignedDoctorId?.userId?.name ||
                        'N/A'}
                    </TableCell>
                    <TableCell>{visit.referredBy?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(visit.visitDate).toLocaleString()}</TableCell>
                    <TableCell>{visit.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        !loading && (
          <Typography sx={{ mt: 3, fontStyle: 'italic', color: 'gray' }}>
            No visits found or no data available.
          </Typography>
        )
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default PatientVisitsViewer;
