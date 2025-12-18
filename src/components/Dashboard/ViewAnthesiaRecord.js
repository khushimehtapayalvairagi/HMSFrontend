import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const ViewAnesthesiaRecord = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('jwt');

  const fetchAllData = async () => {
    try {
      // Fetch all patients
      const patientsRes = await axios.get(
        `${BASE_URL}/api/receptionist/patients`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const allPatients = patientsRes.data.patients || [];

      // Fetch anesthesia records
      const anesthRes = await axios.get(
        `${BASE_URL}/api/procedures/anesthesia-records`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const allAnesthesia = anesthRes.data.records || [];

      // Match anesthesia to patient info if a link exists
      const enrichedRecords = allAnesthesia.map(rec => {
        // rec.patientId must exist in records for this match to work
        const matchedPatient = allPatients.find(
          pat => pat._id === rec.patientId
        );
        return {
          ...rec,
          patient: {
            fullName: matchedPatient?.fullName || 'Unknown'
          }
        };
      });

      setRecords(enrichedRecords);
      setFilteredRecords(enrichedRecords);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = records.filter(record =>
      record.patient?.fullName?.toLowerCase().includes(lower)
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
              {filteredRecords.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{record.patientId?.fullName}</TableCell>
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

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>📝 Anesthesia Record Details</DialogTitle>
        <DialogContent dividers>
          {selectedRecord && (
            <>
              <p><strong>👤 Patient:</strong> {selectedRecord.patientId?.fullName}</p>
              <p><strong>👨‍⚕️ Anesthetist:</strong> {selectedRecord.anestheticId?.userId?.name || 'N/A'}</p>
              <p><strong>💉 Anesthesia:</strong> {selectedRecord.anesthesiaName} ({selectedRecord.anesthesiaType})</p>
             <p><strong>📌 Procedure Type:</strong> {selectedRecord.procedureType || 'N/A'}</p>

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
