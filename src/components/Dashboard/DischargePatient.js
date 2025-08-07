import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const DischargePatient = () => {
  const [admissions, setAdmissions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);
  const token = localStorage.getItem('jwt');
const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchAdmittedPatients = async () => {
    try {
      const patientRes = await axios.get(`${BASE_URL}/api/receptionist/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const admittedAdmissions = [];

      for (const patient of patientRes.data.patients) {
        const res = await axios.get(`${BASE_URL}/api/ipd/admissions/${patient._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const admissions = res.data.admissions || [];
        const admitted = admissions.filter(adm => adm.status === 'Admitted');
        admittedAdmissions.push(...admitted);
      }

      setAdmissions(admittedAdmissions);
    } catch (err) {
      toast.error('Failed to fetch admitted patients');
    }
  };

  const handleDischarge = async () => {
    try {
      await axios.put(`${BASE_URL}/api/ipd/admissions/${selectedAdmissionId}/discharge`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Patient discharged');
      setAdmissions(prev => prev.filter(adm => adm._id !== selectedAdmissionId));
      setOpenDialog(false);
    } catch (err) {
      toast.error('Unpaid bills');
    }
  };

  const handleOpenDialog = (id) => {
    setSelectedAdmissionId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAdmissionId(null);
  };

  useEffect(() => {
    fetchAdmittedPatients();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Currently Admitted Patients</h2>
      <table border="1" cellPadding="10" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Ward</th>
            <th>Bed</th>
            <th>Admitted On</th>
            <th>Expected Discharge</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admissions.length === 0 ? (
            <tr><td colSpan="6">No admitted patients</td></tr>
          ) : (
            admissions.map(adm => (
              <tr key={adm._id}>
                <td>{adm.patientId?.fullName || 'N/A'}</td>
                <td>{adm.wardId?.name || 'N/A'}</td>
                <td>{adm.bedNumber}</td>
                <td>{new Date(adm.createdAt).toLocaleString()}</td>
                <td>{new Date(adm.expectedDischargeDate).toLocaleDateString()}</td>
                <td>
                  <IconButton onClick={() => handleOpenDialog(adm._id)} color="primary">
                    <ExitToAppIcon />
                  </IconButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Discharge</DialogTitle>
        <DialogContent>Are you sure you want to discharge this patient?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary" variant="outlined">Cancel</Button>
          <Button onClick={handleDischarge} color="primary" variant="contained">Discharge</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default DischargePatient;
