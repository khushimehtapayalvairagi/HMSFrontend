import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  FormControl,
  useMediaQuery
} from '@mui/material';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '@mui/material/styles';

const NurseScheduledProcedures = () => {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Scheduled');
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchAllProcedures = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const res = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const patients = res.data.patients || [];

      const allProcedurePromises = patients.map(patient =>
        axios
          .get(`${BASE_URL}/api/procedures/schedules/${patient._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(res => res.data.procedures.map(proc => ({ ...proc, patient })))
          .catch(() => [])
      );

      const allProcedures = (await Promise.all(allProcedurePromises)).flat();
      setProcedures(allProcedures);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load procedures');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('jwt');
    try {
      await axios.put(
        `${BASE_URL}/api/procedures/schedules/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Status updated to ${newStatus}`);
      setProcedures(prev => prev.map(p => (p._id === id ? { ...p, status: newStatus } : p)));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchAllProcedures();
  }, []);

  const filteredProcedures = procedures.filter(p => p.status === activeTab);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>Loading procedures...</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="1200px" mx="auto" my={4} px={2}>
      <Typography variant="h5" gutterBottom textAlign="center" fontWeight="bold">
        Nurse Dashboard – Procedures
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons={isMobile ? "auto" : false}
        centered={!isMobile}
        sx={{
          mb: 4,
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          boxShadow: 2,
          '& .MuiTabs-indicator': {
            backgroundColor: '#2e7d32',
            height: 4,
            borderRadius: 2,
          },
        }}
      >
        {['Scheduled', 'In Progress', 'Completed'].map(tab => (
          <Tab
            key={tab}
            label={tab}
            value={tab}
            sx={{
              fontWeight: 'bold',
              color: activeTab === tab ? '#2e7d32' : 'gray',
              '&.Mui-selected': { color: '#2e7d32' },
            }}
          />
        ))}
      </Tabs>

      {filteredProcedures.length === 0 ? (
        <Typography align="center" mt={4}>
          No procedures found in "{activeTab}" tab.
        </Typography>
      ) : (
        <>
          {isMobile ? (
            <Grid container spacing={2}>
              {filteredProcedures.map(proc => (
                <Grid item xs={12} key={proc._id}>
                  <Card sx={{ borderLeft: '5px solid #2e7d32' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {proc.procedureId?.name || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Patient:</strong> {proc.patient?.fullName || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Date & Time:</strong> {new Date(proc.scheduledDateTime).toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Room:</strong> {proc.procedureType?.toLowerCase() === 'ot'
                          ? proc.roomId?.name || 'N/A'
                          : proc.labourRoomId?.name || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Type:</strong> {proc.procedureType}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Surgeon:</strong> {proc.surgeonId?.userId?.name || 'N/A'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Status:</strong> {proc.status}
                      </Typography>
                      {proc.status !== 'Completed' && (
                        <FormControl fullWidth size="small">
                          <Select
                            displayEmpty
                            value=""
                            onChange={(e) => updateStatus(proc._id, e.target.value)}
                          >
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Procedure</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Surgeon</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Update</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProcedures.map((proc) => (
                    <TableRow key={proc._id}>
                      <TableCell>{proc.procedureId?.name || 'N/A'}</TableCell>
                      <TableCell>{proc.patient?.fullName || 'N/A'}</TableCell>
                      <TableCell>{new Date(proc.scheduledDateTime).toLocaleString()}</TableCell>
                      <TableCell>
                        {proc.procedureType?.toLowerCase() === 'ot'
                          ? proc.roomId?.name || 'N/A'
                          : proc.labourRoomId?.name || 'N/A'}
                      </TableCell>
                      <TableCell>{proc.procedureType}</TableCell>
                      <TableCell>{proc.surgeonId?.userId?.name || 'N/A'}</TableCell>
                      <TableCell>{proc.status}</TableCell>
                      <TableCell>
                        {proc.status !== 'Completed' && (
                          <FormControl fullWidth size="small">
                            <Select
                              displayEmpty
                              value=""
                              onChange={(e) => updateStatus(proc._id, e.target.value)}
                            >
                              <MenuItem value="In Progress">In Progress</MenuItem>
                              <MenuItem value="Completed">Completed</MenuItem>
                              <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      <ToastContainer />
    </Box>
  );
};

export default NurseScheduledProcedures;
