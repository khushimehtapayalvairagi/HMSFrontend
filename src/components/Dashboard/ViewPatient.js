import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  IconButton,
  InputAdornment,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewPatient = () => {
  const [patients, setPatients] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredPatient, setFilteredPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openRow, setOpenRow] = useState(null);
const [selectedPatient, setSelectedPatient] = useState(null);
const [dialogOpen, setDialogOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(
          "http://localhost:8000/api/receptionist/patients",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const activePatients = res.data.patients?.filter(
          (p) => p.status.toLowerCase() !== "discharged"
        );
        setPatients(activePatients || []);
      } catch (err) {
        toast.error("Failed to fetch patients");
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = async () => {
    if (!searchId.trim()) return toast.warn("Enter patient ID to search");
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(
        `http://localhost:8000/api/receptionist/patients/${searchId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const patient = res.data.patient;
      if (patient.status.toLowerCase() === "discharged") {
        setFilteredPatient(null);
        toast.warn("Patient is discharged and not shown.");
      } else {
        setFilteredPatient(patient);
      }
    } catch (err) {
      setFilteredPatient(null);
      toast.error(err.response?.data?.message || "Patient not found.");
    } finally {
      setLoading(false);
    }
  };

  const renderTableRow = (p, index) => (
    <React.Fragment key={p.patientId}>
      <TableRow hover>
        <TableCell>{p.patientId}</TableCell>
        <TableCell>{p.fullName}</TableCell>
        {!isMobile && <TableCell>{new Date(p.dob).toLocaleDateString()}</TableCell>}
        {!isMobile && <TableCell>{p.gender}</TableCell>}
        {!isMobile && <TableCell>{p.contactNumber}</TableCell>}
        <TableCell>{p.status}</TableCell>
        <TableCell>
        <IconButton onClick={() => {
  setSelectedPatient(p);
  setDialogOpen(true);
}}>
  <ExpandMoreIcon />
</IconButton>

        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={isMobile ? 4 : 7} sx={{ p: 0, border: 0 }}>
          <Collapse in={openRow === index} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, bgcolor: "#f9f9f9" }}>
              <Typography><strong>Email:</strong> {p.email}</Typography>
              <Typography><strong>Address:</strong> {p.address}</Typography>
              <Typography mt={1}><strong>Relatives:</strong></Typography>
              {p.relatives?.length ? (
                <ul>
                  {p.relatives.map((r, i) => (
                    <li key={i}>
                      {r.name} ({r.relationship}) - {r.contactNumber}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No relatives listed.</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );

  const rowsToRender = filteredPatient
    ? [filteredPatient]
    : [...patients].reverse();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Patient Records
      </Typography>

      <TextField
        label="Search by Patient ID"
        variant="outlined"
        fullWidth
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Patient ID</TableCell>
                <TableCell>Name</TableCell>
                {!isMobile && <TableCell>DOB</TableCell>}
                {!isMobile && <TableCell>Gender</TableCell>}
                {!isMobile && <TableCell>Contact</TableCell>}
                <TableCell>Status</TableCell>
                <TableCell>More</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsToRender.map((p, i) => renderTableRow(p, i))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle>Patient Details</DialogTitle>
  <DialogContent dividers>
    {selectedPatient && (
      <>
        <Typography><strong>Full Name:</strong> {selectedPatient.fullName}</Typography>
        <Typography><strong>DOB:</strong> {new Date(selectedPatient.dob).toLocaleDateString()}</Typography>
        <Typography><strong>Gender:</strong> {selectedPatient.gender}</Typography>
        <Typography><strong>Email:</strong> {selectedPatient.email}</Typography>
        <Typography><strong>Contact Number:</strong> {selectedPatient.contactNumber}</Typography>
        <Typography><strong>Address:</strong> {selectedPatient.address}</Typography>
        <Typography mt={2}><strong>Relatives:</strong></Typography>
        {selectedPatient.relatives?.length ? (
          <ul>
            {selectedPatient.relatives.map((r, i) => (
              <li key={i}>
                {r.name} ({r.relationship}) - {r.contactNumber}
              </li>
            ))}
          </ul>
        ) : (
          <Typography>No relatives listed.</Typography>
        )}
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDialogOpen(false)} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

    </Container>
  );
};

export default ViewPatient;
