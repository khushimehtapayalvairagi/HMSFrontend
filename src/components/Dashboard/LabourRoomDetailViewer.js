import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const LabourRoomDetailViewer = () => {
  const { procedureScheduleId } = useParams();
  const [labourDetailsList, setLabourDetailsList] = useState([]);
  const [patientsMap, setPatientsMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
const BASE_URL = process.env.REACT_APP_BASE_URL;

  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const patientRes = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const patients = patientRes.data.patients;
        const patientMapObj = {};
        patients.forEach(p => {
          patientMapObj[p._id] = p.fullName;
        });
        setPatientsMap(patientMapObj);

        let details = [];
        await Promise.all(
          patients.map(async (p) => {
            try {
              const scheduleRes = await axios.get(`${BASE_URL}/api/procedures/schedules/${p._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const labourProcedures = scheduleRes.data.procedures?.filter(proc => proc.procedureType === 'Labour Room');
              await Promise.all(
                labourProcedures.map(async (lp) => {
                  try {
                    const detailRes = await axios.get(`${BASE_URL}/api/procedures/labour-details/${lp._id}`, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    if (detailRes.data.detail) {
                      details.push(detailRes.data.detail);
                    }
                  } catch (err) {
                    // Skip if detail missing
                  }
                })
              );
            } catch {
              // Skip this patient
            }
          })
        );
        setLabourDetailsList(details);
      } catch (err) {
        console.error('Error fetching Labour Room records:', err);
        toast.error('Failed to load Labour Room records');
      }
    };

    fetchAll();
  }, [token]);

  const filteredList = labourDetailsList.filter(d => {
    const name = patientsMap[d.patientId?._id || d.patientId] || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Labour Room Records</h2>

      <input
        type="text"
        placeholder="Search by patient name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: '8px', marginBottom: '1rem', width: '100%' }}
      />

      {filteredList.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
                <TableRow>
    <TableCell sx={{ fontWeight: 'bold' }}>👤 Patient</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
  </TableRow>
            </TableHead>
            <TableBody>
              {filteredList.map((d, index) => (
                <TableRow key={index}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{patientsMap[d.patientId?._id || d.patientId] || 'Unknown'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => { setSelectedDetail(d); setDialogOpen(true); }}>
                      <ExpandMoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>👶 Labour Room Detail</DialogTitle>
        <DialogContent dividers>
          {selectedDetail && (
            <>
              <p><strong>Patient:</strong> {patientsMap[selectedDetail.patientId?._id || selectedDetail.patientId]}</p>
              <p><strong>Baby Name:</strong> {selectedDetail.babyName || 'N/A'}</p>
              <p><strong>Gender:</strong> {selectedDetail.gender}</p>
              <p><strong>Date of Birth:</strong> {new Date(selectedDetail.dobBaby).toLocaleDateString()}</p>
              <p><strong>Time of Birth:</strong> {selectedDetail.timeOfBirth}</p>
              <p><strong>Weight:</strong> {selectedDetail.weight || 'N/A'}</p>
              <p><strong>Delivery Type:</strong> {selectedDetail.deliveryType}</p>
              <p><strong>Captured By:</strong> {selectedDetail.capturedByUserId?.name} ({selectedDetail.capturedByUserId?.role})</p>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} variant="contained" color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LabourRoomDetailViewer;
