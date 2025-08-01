import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewAnesthesiaRecord = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
      const filteredProcedures = allProcedures.filter(p => p.status === 'Scheduled');

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
      setFilteredRecords(validRecords);
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

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = records.filter(record =>
      record?.patient?.fullName?.toLowerCase().includes(lower)
    );
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  const handleOpenDialog = (record) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRecord(null);
  };

  if (loading) return <div style={styles.centerText}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Anesthesia Records</h2>

      <input
        type="text"
        placeholder="Search by patient name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {filteredRecords.length === 0 ? (
        <div style={styles.centerText}>No records found.</div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>👤 Patient Name</strong></TableCell>
                <TableCell><strong>Details</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.map((record, index) => (
                <TableRow key={record._id || index}>
                  <TableCell>{record.patient?.fullName || 'Unknown'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(record)}>
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
    <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
  <DialogTitle>📝 Anesthesia Record Details</DialogTitle>
  <DialogContent dividers>
    {selectedRecord && (
      <>
        <p><strong>👤 Patient:</strong> {selectedRecord.patient?.fullName || 'Unknown'}</p>
        <p><strong>🩺 Procedure:</strong> {selectedRecord.procedureName || 'N/A'}</p>
        <p><strong>👨‍⚕️ Anesthetist:</strong> {selectedRecord.anestheticId?.userId?.name || 'N/A'}</p>
        <p><strong>💉 Anesthesia:</strong> {selectedRecord.anesthesiaName} ({selectedRecord.anesthesiaType})</p>
        <p><strong>⏱️ Induce Time:</strong> {selectedRecord.induceTime ? new Date(selectedRecord.induceTime).toLocaleString() : 'N/A'}</p>
        <p><strong>✅ End Time:</strong> {selectedRecord.endTime ? new Date(selectedRecord.endTime).toLocaleString() : 'N/A'}</p>
        <p><strong>💊 Medicines Used:</strong> {selectedRecord.medicinesUsedText || 'N/A'}</p>
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} color="primary" variant="contained">
      Close
    </Button>
  </DialogActions>
</Dialog>


      <ToastContainer />
    </div>
  );
};

export default ViewAnesthesiaRecord;

// Styles
const styles = {
  container: {
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '1rem',
    fontFamily: 'Segoe UI, sans-serif'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#003366'
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    fontSize: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '1.5rem'
  },
  centerText: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '16px',
    color: '#555'
  }
};
