import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Divider, IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const PreviousConsultations = () => {
  const { patientId } = useParams();
  const [consultations, setConsultations] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [relatedAdmission, setRelatedAdmission] = useState(null);

  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [consultRes, admitRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/doctor/opd-consultations/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8000/api/ipd/admissions/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setConsultations(consultRes.data.consultations || []);
        setAdmissions(admitRes.data.admissions || []);
      } catch (err) {
        console.error("Error fetching records:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [patientId]);

  const handleOpenDialog = (consultation) => {
    setSelectedConsultation(consultation);
    const matchedAdmission = admissions.find(a => {
      const consultDate = new Date(consultation.createdAt);
      const admitDate = new Date(a.createdAt);
      return Math.abs(consultDate - admitDate) < 1000 * 60 * 60 * 24 * 2; // within 2 days
    });
    setRelatedAdmission(matchedAdmission || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedConsultation(null);
    setRelatedAdmission(null);
  };

  if (loading) return <p>Loading patient records...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h3>📝 Previous OPD Consultations</h3>
      {consultations.length === 0 ? (
        <p>No consultations found.</p>
      ) : consultations.map((c, index) => (
        <div key={c._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
          <Typography variant="subtitle2"><strong>Sr No:</strong> {index + 1}</Typography>
          <Typography><strong>Date:</strong> {new Date(c.consultationDateTime || c.createdAt).toLocaleString()}</Typography>
          <Typography><strong>Complaint:</strong> {c.chiefComplaint}</Typography>

          <Button
            startIcon={<InfoIcon />}
            onClick={() => handleOpenDialog(c)}
            variant="outlined"
            sx={{ mt: 1 }}
          >
            Open Details
          </Button>
        </div>
      ))}

      {/* Dialog with Consultation + IPD Admission */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Consultation & IPD Admission Details</DialogTitle>
        <DialogContent dividers>
          {selectedConsultation && (
            <>
              <Typography variant="h6">🩺 OPD Consultation</Typography>
              <Typography><strong>Date:</strong> {new Date(selectedConsultation.consultationDateTime || selectedConsultation.createdAt).toLocaleString()}</Typography>
              <Typography><strong>Complaint:</strong> {selectedConsultation.chiefComplaint}</Typography>
              <Typography><strong>Diagnosis:</strong> {selectedConsultation.diagnosis}</Typography>
              <Typography><strong>Doctor Notes:</strong> {selectedConsultation.doctorNotes}</Typography>
              <Typography><strong>Medicines:</strong> {selectedConsultation.medicinesPrescribedText}</Typography>
              {selectedConsultation.transcribedFromPaperNotes && (
                <Typography><strong>Transcribed By:</strong> {selectedConsultation.transcribedByUserId?.name || 'N/A'}</Typography>
              )}
              <Divider sx={{ my: 2 }} />
            </>
          )}

          {relatedAdmission ? (
            <>
              <Typography variant="h6">🏥 Related IPD Admission</Typography>
              <Typography><strong>Admitted On:</strong> {new Date(relatedAdmission.createdAt).toLocaleString()}</Typography>
              <Typography><strong>Status:</strong> {relatedAdmission.status}</Typography>
              <Typography><strong>Ward:</strong> {relatedAdmission.wardId?.name}</Typography>
              <Typography><strong>Bed Number:</strong> {relatedAdmission.bedNumber}</Typography>
              <Typography><strong>Room Category:</strong> {relatedAdmission.roomCategoryId?.name}</Typography>
              <Typography><strong>Expected Discharge:</strong> {relatedAdmission.expectedDischargeDate ? new Date(relatedAdmission.expectedDischargeDate).toLocaleDateString() : 'N/A'}</Typography>
              {relatedAdmission.actualDischargeDate && (
                <Typography><strong>Discharged On:</strong> {new Date(relatedAdmission.actualDischargeDate).toLocaleDateString()}</Typography>
              )}
            </>
          ) : (
            <Typography>No matching IPD admission found for this consultation.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PreviousConsultations;
