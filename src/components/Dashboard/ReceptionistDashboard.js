import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemText,
  CssBaseline, Divider, IconButton, useMediaQuery, ListItemIcon
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  LocalPharmacy as PharmacyIcon,
  Hotel as IpdIcon,
  Science as LabIcon,
  EventNote as OpdIcon,
  ReceiptLong as BillingIcon,
  PlaylistAddCheck as AdmissionIcon,
  ListAlt as ListIcon,
  Inventory as ProcedureIcon,
  Assignment as AnesthesiaIcon,
  ChildCare as LabourRoomIcon,
  EventNote as EventNoteIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Receipt as ViewBillIcon,
  HowToReg as PatientIcon,
  MedicalInformation as VisitIcon,
} from '@mui/icons-material';

import { useTheme } from '@mui/material/styles';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SocketContext from '../../context/SocketContext';

const drawerWidth = 260;

const ReceptionistDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // for desktop
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
           
            { label: "Update Visit Status", path: "/receptionist-dashboard/UpdatePatientStatus", icon: <VisitIcon /> },
           
            { label: "Patient Visits Viewer", path: "/receptionist-dashboard/patient-visits-viewer", icon: <PharmacyIcon /> },
            { label: "IPD Admission Form", path: "/receptionist-dashboard/IPDAdmissionForm", icon: <AdmissionIcon /> },
            { label: "Procedure Form", path: "/receptionist-dashboard/ProcedureForm", icon: <ProcedureIcon /> },
            { label: "Anesthesia Form", path: "/receptionist-dashboard/AnesthesiaForm", icon: <AnesthesiaIcon /> },
            { label: "View Anesthesia Form", path: "/receptionist-dashboard/ViewAnesthesiaForm", icon: <AnesthesiaIcon /> },
            { label: "Labour Room", path: "/receptionist-dashboard/LabourRoom", icon: <LabourRoomIcon /> },
            { label: "View Labour Room", path: "/receptionist-dashboard/ViewLabourRoom", icon: <LabourRoomIcon /> },
            { label: "Record Prescription", path: "/receptionist-dashboard/record-prescription", icon: <IpdIcon /> },
            { label: "Daily Reports", path: "/receptionist-dashboard/DailyReports", icon: <EventNoteIcon /> },
            { label: "prescription-record", path: "/receptionist-dashboard/patient-record-prescription", icon: <HistoryIcon /> },
            { label: "Billing", path: "/receptionist-dashboard/Billing", icon: <BillingIcon /> },
            { label: "View Bill", path: "/receptionist-dashboard/ViewBill", icon: <ViewBillIcon /> },
            { label: "Payment Form", path: "/receptionist-dashboard/PaymentForm", icon: <PaymentIcon /> },
            { label: "Discharge Patient", path: "/receptionist-dashboard/DischargePatient", icon: <LabIcon /> },
            { label: "Bill Payment History", path: "/receptionist-dashboard/BillPaymentHistory", icon: <HistoryIcon /> },
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Top AppBar */}
   {/* Top AppBar */}
<AppBar
  position="fixed"
  sx={{
    zIndex: 1201,
    backgroundColor: 'purple',
    // remove width and ml adjustments
    transition: 'all 0.3s ease',
  }}
>
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <IconButton
      color="inherit"
      onClick={() => {
        if (isMobile) setMobileOpen(prev => !prev);
        else setSidebarOpen(prev => !prev);
      }}
      edge="start"
    >
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


      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: sidebarOpen ? drawerWidth : 0 }, flexShrink: { md: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
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

        {/* Desktop Drawer */}
        <Drawer
          variant="persistent"
          open={sidebarOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid #e0e0e0',
              paddingTop: '64px',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
  {/* Main Content */}
<Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 3,
    transition: 'margin 0.3s ease',
    marginLeft: { xs: 0, md: sidebarOpen ? `${drawerWidth}px` : 0 },
    width: '100%',
    backgroundColor: '#f4f6f8',
  }}
>
  <Box sx={{ maxWidth: '1200px', mx: 'auto' }}> {/* ✅ centers content properly */}
    <Toolbar />
    <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
      Hospital Management System
    </Typography>

    <SocketContext />
    <Outlet />
    <ToastContainer position="top-right" autoClose={3000} />
  </Box>
</Box>



    </Box>
  );
};

export default ReceptionistDashboard;
