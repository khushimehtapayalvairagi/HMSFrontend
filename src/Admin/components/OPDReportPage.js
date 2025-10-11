import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TextField,
  Button,
} from "@mui/material";

export default function OPDReportPage({standalone}) {
  const [report, setReport] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const printRef = useRef();

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchReport = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date");
      return;
    }
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(`${BASE_URL}/api/reports/monthly-opd-ipd-report`, {
        params: { fromDate, toDate },
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(res.data.report || []);
      setDepartments(res.data.departments || []);
    } catch (err) {
      console.error("Report fetch error:", err.response?.data || err.message);
      alert("Error fetching report. Check console for details.");
    }
  };
const handlePrint = () => {
  window.print();
};


  return (
      <div className={standalone ? 'standalone-report' : 'with-dashboard'}>
      {!standalone && <div className="navbar no-print">Navbar goes here</div>}
    <div id="printable-report">
 <div style={{ padding: 20 }}>
      {/* Controls - hidden in print */}
      <div className="no-print" style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "center" }}>
        <TextField
          type="date"
          label="From Date"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <TextField
          type="date"
          label="To Date"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <Button variant="contained" onClick={fetchReport}>
          Generate
        </Button>
        <Button variant="outlined" color="secondary" onClick={handlePrint}>
          Print Report
        </Button>
      </div>

      {/* Printable content */}
      <div ref={printRef}>
        <Typography variant="h6" align="center" gutterBottom>
          NAME OF UNANI COLLEGE: Dr. M.I.J. Tibbia Unani Medical College, Versova, Andheri (W), Mumbai-61
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Departmentwise Information of OPD, IPD, OT & LABOUR ROOM PATIENTS (FORMAT-A)
        </Typography>

        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#2c3e50" }}>
              <TableCell style={{ color: "white", border: "1px solid #000" }}>Sr.No</TableCell>
              <TableCell style={{ color: "white", border: "1px solid #000" }}>From – To</TableCell>

              {departments.map((d) => (
                <TableCell key={`opd-${d}`} style={{ color: "white", border: "1px solid #000" }}>
                  {d} (OPD)
                </TableCell>
              ))}
              <TableCell style={{ color: "white", border: "1px solid #000" }}>OPD Total</TableCell>
              <TableCell style={{ color: "white", border: "1px solid #000" }}>OPD Daily Avg</TableCell>

              {departments.map((d) => (
                <TableCell key={`ipd-${d}`} style={{ color: "white", border: "1px solid #000" }}>
                  {d} (IPD)
                </TableCell>
              ))}
              <TableCell style={{ color: "white", border: "1px solid #000" }}>IPD Total</TableCell>
              <TableCell style={{ color: "white", border: "1px solid #000" }}>IPD Daily Avg</TableCell>

              <TableCell style={{ color: "white", border: "1px solid #000" }}>OT Total</TableCell>
              <TableCell style={{ color: "white", border: "1px solid #000" }}>Labour Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {report.length === 0 ? (
              <TableRow>
                <TableCell colSpan={departments.length * 2 + 6} align="center" style={{ border: "1px solid #000" }}>
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              report.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell style={{ border: "1px solid #000" }}>{idx + 1}</TableCell>
                  <TableCell style={{ border: "1px solid #000" }}>{`${formatDate(r.fromDate)} to ${formatDate(
                    r.toDate
                  )}`}</TableCell>

                  {departments.map((d) => (
                    <TableCell key={`opd-${d}-${idx}`} style={{ border: "1px solid #000" }}>
                      {r.opd[d] || 0}
                    </TableCell>
                  ))}
                  <TableCell style={{ border: "1px solid #000" }}>{r.opd.total}</TableCell>
                  <TableCell style={{ border: "1px solid #000" }}>{r.opd.dailyAvg}</TableCell>

                  {departments.map((d) => (
                    <TableCell key={`ipd-${d}-${idx}`} style={{ border: "1px solid #000" }}>
                      {r.ipd[d] || 0}
                    </TableCell>
                  ))}
                  <TableCell style={{ border: "1px solid #000" }}>{r.ipd.total}</TableCell>
                  <TableCell style={{ border: "1px solid #000" }}>{r.ipd.dailyAvg}</TableCell>

                  <TableCell style={{ border: "1px solid #000" }}>{r.ot.total}</TableCell>
                  <TableCell style={{ border: "1px solid #000" }}>{r.labour.total}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <style>
        {`
          @media print {
            .no-print, .navbar, .sidebar { display: none !important; }
            body { margin: 10mm; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
            th, td { border: 1px solid #000 !important; padding: 6px !important; text-align: center; }
            th { background-color: #2c3e50 !important; color: white !important; }
          }
        `}
      </style>
    </div>
    </div>
   </div>
  );
}
