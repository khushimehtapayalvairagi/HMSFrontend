import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemText,
  CssBaseline, IconButton, useMediaQuery, ListItemIcon
} from '@mui/material';
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  LocalPharmacy as PharmacyIcon,
  Hotel as IpdIcon,
  Science as LabIcon,
  ReceiptLong as BillingIcon,
  PlaylistAddCheck as AdmissionIcon,
  Inventory as ProcedureIcon,
  Assignment as AnesthesiaIcon,
  ChildCare as LabourRoomIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Receipt as ViewBillIcon,
  HowToReg as PatientIcon,
  MedicalInformation as VisitIcon,
  EventNote as DailyReportIcon,
  Assignment as ProcedureTaskIcon, // For Nurse scheduled procedures
  Home as HomeIcon, // For Nurse IPD Admissions
} from '@mui/icons-material';

import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SocketContext from '../../context/SocketContext';

const drawerWidth = 260;

const ReceptionistDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { patientId } = useParams();

  const handleNav = (path, menuLabel) => {
    const token = localStorage.getItem('jwt');
    if (token && token !== "null") {
      setActiveMenu(menuLabel);
      navigate(path);
      if (isMobile) setMobileOpen(false);
    } else {
      toast.error("Please login first.");
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ flexGrow: 1 }}>
        <List sx={{ py: 1 }}>
          {[
            { label: "Patient", path: "/receptionist-dashboard/patient-form", icon: <IpdIcon /> },
            { label: "View Patient", path: "/receptionist-dashboard/viewPatient", icon: <PersonIcon /> },
            { label: "Visit Form", path: "/receptionist-dashboard/visit-form", icon: <VisitIcon /> },
            { label: "Patient Visits Viewer", path: "/receptionist-dashboard/patient-visits-viewer", icon: <PharmacyIcon /> },
            { label: "IPD Admission Form", path: "/receptionist-dashboard/IPDAdmissionForm", icon: <AdmissionIcon /> },
            { label: "Procedure Form", path: "/receptionist-dashboard/ProcedureForm", icon: <ProcedureIcon /> },
            { label: "View Anesthesia Form", path: "/receptionist-dashboard/ViewAnesthesiaForm", icon: <AnesthesiaIcon /> },
            { label: "Labour Room", path: "/receptionist-dashboard/LabourRoom", icon: <LabourRoomIcon /> },
            { label: "View Labour Room", path: "/receptionist-dashboard/ViewLabourRoom", icon: <LabourRoomIcon /> },
            { label: "Billing", path: "/receptionist-dashboard/Billing", icon: <BillingIcon /> },
            { label: "View Bill", path: "/receptionist-dashboard/ViewBill", icon: <ViewBillIcon /> },
            { label: "Payment Form", path: "/receptionist-dashboard/PaymentForm", icon: <PaymentIcon /> },
            { label: "Discharge Patient", path: "/receptionist-dashboard/DischargePatient", icon: <LabIcon /> },
            { label: "Bill Payment History", path: "/receptionist-dashboard/BillPaymentHistory", icon: <HistoryIcon /> },

            // 🚀 Nurse Modules added here
            { label: "Nurse IPD Admissions", path: "/receptionist-dashboard/NurseIPDAdmissionList", icon: <HomeIcon /> },
            { label: "Nurse Daily Reports", path: "/receptionist-dashboard/ViewDailyReports", icon: <DailyReportIcon /> },
            { label: "Nurse Scheduled Procedures", path: "/receptionist-dashboard/NurseScheduledProcedures", icon: <ProcedureTaskIcon /> },
          ].map(({ label, path, icon }) => (
            <ListItem
              key={label}
              button
              onClick={() => handleNav(path, label)}
              sx={{
                px: 3,
                py: 1,
                cursor: 'pointer',
                backgroundColor: activeMenu === label ? '#e3f2fd' : 'transparent',
                borderLeft: activeMenu === label ? '4px solid #1976d2' : 'none',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                }
              }}
            >
              <ListItemIcon sx={{ color: activeMenu === label ? '#1976d2' : 'inherit', minWidth: 36 }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: activeMenu === label ? '#1976d2' : 'inherit'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: 'purple' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton color="inherit" onClick={() => setMobileOpen(prev => !prev)} edge="start">
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => {
              localStorage.removeItem("jwt");
              window.location.href = "/";
            }}
            edge="end"
            title="Logout"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid #e0e0e0',
              paddingTop: '64px',
              alignItems: 'flex-start',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ p: 3, width: "100%" }}>
        <Toolbar />
        <Typography variant="body1" sx={{ mb: 2 }}>
          Hospital Management System
        </Typography>
        <SocketContext />
        <Outlet />
        <ToastContainer position="top-right" autoClose={3000} />
      </Box>
    </Box>
  );
};

export default ReceptionistDashboard;
