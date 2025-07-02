import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemText,
  CssBaseline, Divider, Avatar, ListItemIcon, IconButton, useMediaQuery
} from '@mui/material';
import {
  Home as HomeIcon, Person as PersonIcon, Settings as SettingsIcon,
  Logout as LogoutIcon, Menu as MenuIcon,
  AssignmentInd as ReceptionIcon,
  LocalPharmacy as PharmacyIcon,
  Hotel as IpdIcon,
  Science as LabIcon,
  EventNote as OpdIcon,
  ReceiptLong as BillingIcon,
  BabyChangingStation as OtIcon
} from '@mui/icons-material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const drawerWidth = 260;

const menuItems = [
  { text: 'Home', icon: <HomeIcon /> },
  { text: 'Profile', icon: <PersonIcon /> },
  { text: 'Settings', icon: <SettingsIcon /> },
  { text: 'Logout', icon: <LogoutIcon /> },
];

const ReceptionistDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
const navigate = useNavigate();

const handleNav = (path,menuLabel) => {
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
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    {/* Profile */}
    <Box sx={{ textAlign: 'center', p: 2, pt: 3 }}>
    </Box>

    <Divider sx={{ my: 2 }} />

    {/* Navigation Modules */}
  <Box sx={{ flexGrow: 1, alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
  <List sx={{ width: '100%' }}>

        {/* Home */}
        <ListItem button  sx={{
    px: 3,
    width: '100%', // Ensure full width
    justifyContent: 'flex-start', // Align contents to the left
    backgroundColor: activeMenu === 'Home' ? '#e3f2fd' : 'transparent',
    borderLeft: activeMenu === 'Home' ? '4px solid #1976d2' : 'none',
   cursor: 'pointer', }}onClick={() => handleNav("/receptionist-dashboard/Home", "Home")}
>
          <ListItemIcon sx={{ minWidth: 36 }}><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItem>
        <ListItem button     sx={{
    px: 3,
    width: '100%', // Ensure full width
    justifyContent: 'flex-start', // Align contents to the left
    backgroundColor: activeMenu === 'Patient' ? '#e3f2fd' : 'transparent',
    borderLeft: activeMenu === 'Patient' ? '4px solid #1976d2' : 'none',
   cursor: 'pointer', }}onClick={() => handleNav("/receptionist-dashboard/patient-form", "Patient")}
>
  <ListItemIcon sx={{ minWidth: 36 }}><IpdIcon /></ListItemIcon>
  <ListItemText primary="Patient" primaryTypographyProps={{
      fontWeight: 500,
      color: activeMenu === 'Patient' ? '#1976d2' : 'inherit'
    }} />
</ListItem>

        {/* Profile */}
        <ListItem button    sx={{
    px: 3,
    width: '100%', // Ensure full width
    justifyContent: 'flex-start', // Align contents to the left
    backgroundColor: activeMenu === 'ViewPatient' ? '#e3f2fd' : 'transparent',
    borderLeft: activeMenu === 'ViewPatient'? '4px solid #1976d2' : 'none',
   cursor: 'pointer', }}onClick={() => handleNav("/receptionist-dashboard/viewPatient",'ViewPatient' )}>
          <ListItemIcon sx={{ minWidth: 36 }}><PersonIcon /></ListItemIcon>
          <ListItemText primary="ViewPatient"primaryTypographyProps={{
      fontWeight: 500,
      color: activeMenu === 'ViewPatient' ? '#1976d2' : 'inherit'
    }} />
        </ListItem>

        {/* Modules under Profile */}
        {/* <ListItem button   sx={{
    px: 3,
    width: '100%', // Ensure full width
    justifyContent: 'flex-start', // Align contents to the left
    backgroundColor: activeMenu === "DoctorAvailable" ? '#e3f2fd' : 'transparent',
    borderLeft: activeMenu === "DoctorAvailable" ? '4px solid #1976d2' : 'none',
  }} onClick={() => handleNav("/receptionist-dashboard/Doctor-Availablity-check" , "DoctorAvailable")}>
          <ListItemIcon sx={{ minWidth: 36 }}><ReceptionIcon /></ListItemIcon>
          <ListItemText primary="DoctorAvailable " primaryTypographyProps={{
      fontWeight: 500,
      color: activeMenu === "DoctorAvailable" ? '#1976d2' : 'inherit'
    }} />
        </ListItem> */}

 <ListItem button   sx={{
    px: 3,
    width: '100%', // Ensure full width
    justifyContent: 'flex-start', // Align contents to the left
    backgroundColor: activeMenu === "Visit Form" ? '#e3f2fd' : 'transparent',
    borderLeft: activeMenu === "Visit Form" ? '4px solid #1976d2' : 'none',
   cursor: 'pointer', }} onClick={() => handleNav("/receptionist-dashboard/visit-form" ,"Visit Form")}>
          <ListItemIcon sx={{ minWidth: 36 }}><MedicalInformationIcon /></ListItemIcon>
          <ListItemText primary="Visit Form "primaryTypographyProps={{
      fontWeight: 500,
      color: activeMenu === 'Visit Form' ? '#1976d2' : 'inherit'
    }} />
        </ListItem>



        <ListItem button   sx={{
    px: 3,
    width: '100%', // Ensure full width
    justifyContent: 'flex-start', // Align contents to the left
    backgroundColor: activeMenu === 'Patient Visits Viewer' ? '#e3f2fd' : 'transparent',
    borderLeft: activeMenu === 'Patient Visits Viewer' ? '4px solid #1976d2' : 'none',
   cursor: 'pointer', }} onClick={() => handleNav("/receptionist-dashboard/patient-visits-viewer","Patient Visits Viewer")}>
          <ListItemIcon sx={{ minWidth: 36 }}><PharmacyIcon /></ListItemIcon>
          <ListItemText primary="Patient Visits Viewer"primaryTypographyProps={{
      fontWeight: 500,
      color: activeMenu === 'Patient Visits Viewer' ? '#1976d2' : 'inherit'
    }} />
        </ListItem>



        <ListItem button    sx={{
    px: 3,
    width: '100%', // Ensure full width
    justifyContent: 'flex-start', // Align contents to the left
    backgroundColor: activeMenu === 'Update Patient Satus' ? '#e3f2fd' : 'transparent',
    borderLeft: activeMenu === 'Update Patient Satus' ? '4px solid #1976d2' : 'none',
   cursor: 'pointer', }} onClick={() => handleNav("/receptionist-dashboard/UpdatePatientStatus","Update Patient Satus")}>
          <ListItemIcon sx={{ minWidth: 36 }}><LabIcon /></ListItemIcon>
          <ListItemText primary="Update Patient Satus" primaryTypographyProps={{
      fontWeight: 500,
      color: activeMenu === "Update Patient Satus" ? '#1976d2' : 'inherit'
    }} />
        </ListItem>

         <ListItem button    sx={{
    px: 3,
    width: '100%', // Ensure full width
    justifyContent: 'flex-start', // Align contents to the left
    backgroundColor: activeMenu === "IPD Admission Form" ? '#e3f2fd' : 'transparent',
    borderLeft: activeMenu === "IPD Admission Form"? '4px solid #1976d2' : 'none',
   cursor: 'pointer', }} onClick={() => handleNav("/receptionist-dashboard/IPDAdmissionForm","IPD Admission Form")}>
          <ListItemIcon sx={{ minWidth: 36 }}><LabIcon /></ListItemIcon>
          <ListItemText primary="IPD Admission Form" primaryTypographyProps={{
      fontWeight: 500,
      color: activeMenu === "IPD Admission Form" ? '#1976d2' : 'inherit'
    }} />
        </ListItem>

       <ListItem button    sx={{
    px: 3,
    width: '100%', // Ensure full width
    justifyContent: 'flex-start', // Align contents to the left
    backgroundColor: activeMenu === "ProcedureForm" ? '#e3f2fd' : 'transparent',
    borderLeft: activeMenu === "ProcedureForm" ? '4px solid #1976d2' : 'none',
   cursor: 'pointer', }} onClick={() => handleNav("/receptionist-dashboard/ProcedureForm" ,"ProcedureForm")}>
          <ListItemIcon sx={{ minWidth: 36 }}><LabIcon /></ListItemIcon>
          <ListItemText primary="ProcedureForm"  primaryTypographyProps={{
      fontWeight: 500,
      color: activeMenu === "ProcedureForm"  ? '#1976d2' : 'inherit'
    }} />
        </ListItem>
            <ListItem button    sx={{
    px: 3,
    width: '100%', // Ensure full width
    justifyContent: 'flex-start', // Align contents to the left
    backgroundColor: activeMenu === "AnesthesiaForm" ? '#e3f2fd' : 'transparent',
    borderLeft: activeMenu === "AnesthesiaForm" ? '4px solid #1976d2' : 'none',
   cursor: 'pointer', }} onClick={() => handleNav("/receptionist-dashboard/AnesthesiaForm" ,"AnesthesiaForm")}>
          <ListItemIcon sx={{ minWidth: 36 }}><LabIcon /></ListItemIcon>
          <ListItemText primary="AnesthesiaForm"  primaryTypographyProps={{
      fontWeight: 500,
      color: activeMenu === "AnesthesiaForm"  ? '#1976d2' : 'inherit'
    }} />
        </ListItem>
                 <ListItem button    sx={{
    px: 3,
    width: '100%', // Ensure full width
    justifyContent: 'flex-start', // Align contents to the left
    backgroundColor: activeMenu === "ViewAnesthesiaForm" ? '#e3f2fd' : 'transparent',
    borderLeft: activeMenu === "ViewAnesthesiaForm" ? '4px solid #1976d2' : 'none',
   cursor: 'pointer', }} onClick={() => handleNav("/receptionist-dashboard/ViewAnesthesiaForm" ,"ViewAnesthesiaForm")}>
          <ListItemIcon sx={{ minWidth: 36 }}><LabIcon /></ListItemIcon>
          <ListItemText primary="ViewAnesthesiaForm"  primaryTypographyProps={{
      fontWeight: 500,
      color: activeMenu === "ViewAnesthesiaForm"  ? '#1976d2' : 'inherit'
    }} />
        </ListItem>
                      <ListItem button    sx={{
    px: 3,
    width: '100%', // Ensure full width
    justifyContent: 'flex-start', // Align contents to the left
    backgroundColor: activeMenu === "LabourRoom" ? '#e3f2fd' : 'transparent',
    borderLeft: activeMenu === "LabourRoom" ? '4px solid #1976d2' : 'none',
   cursor: 'pointer', }} onClick={() => handleNav("/receptionist-dashboard/LabourRoom" ,"LabourRoom")}>
          <ListItemIcon sx={{ minWidth: 36 }}><LabIcon /></ListItemIcon>
          <ListItemText primary="LabourRoom"  primaryTypographyProps={{
      fontWeight: 500,
      color: activeMenu === "LabourRoom"  ? '#1976d2' : 'inherit'
    }} />
        </ListItem>


        <ListItem button sx={{ px: 3 }} onClick={() => isMobile && setMobileOpen(false)}>
          <ListItemIcon sx={{ minWidth: 36 }}><OtIcon /></ListItemIcon>
          <ListItemText primary="OT & Labour Room " primaryTypographyProps={{ fontWeight:500 }} />
        </ListItem>

        {/* Settings */}
        <ListItem button sx={{ px: 3 }} onClick={() => isMobile && setMobileOpen(false)}>
          <ListItemIcon sx={{ minWidth: 36 }}><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItem>
      </List>
    </Box>

    {/* Logout fixed at bottom */}
    <Box sx={{ p: 2 }}>
      <Divider sx={{ mb: 1 }} />
      <List>
        <ListItem button sx={{ px: 3 }}  onClick={() => {
      localStorage.removeItem("jwt");
      window.location.href = "/login";
    }}>
          <ListItemIcon sx={{ minWidth: 36 }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItem>
      </List>
    </Box>
  </Box>
);


  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: '#1976d2' }}>
<Toolbar
  sx={{
    px: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}
>
<Box sx={{ display: 'flex', alignItems: 'center' }}>
    {isMobile && (
      <IconButton
        color="inherit"
        onClick={() => setMobileOpen(prev => !prev)}
        edge="start"
        sx={{ mr: 1 }}
      >
        <MenuIcon />
      </IconButton>
    )}

    {/* Show logo only on desktop */}
    {!isMobile && (
      <>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2967/2967350.png"
          alt="Hospital Logo"
          style={{ width: 40, height: 40 }}
        />
        <Typography variant="h6" noWrap sx={{ ml: 2 }}>
          Hospital Management System
        </Typography>
      </>
    )}
  </Box>

  {/* Right space filler or optional right-side actions */}
  {/* You can add user avatar or notifications here if needed */}
</Toolbar>
      </AppBar>

      {/* Sidebar - Responsive */}
      <Box component="nav">
<Drawer
  variant={isMobile ? 'temporary' : 'permanent'}
  open={isMobile ? mobileOpen : true}
  onClose={() => setMobileOpen(false)}
  ModalProps={{ keepMounted: true }}
  sx={{
    display: { xs: 'block', md: 'block' }, 
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid #e0e0e0',
      paddingTop: '64px',
      alignItems: 'flex-start', // ✅ aligns content to left on all screen sizes
    },
  }}
>

          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 3,
    ml: { md: `${drawerWidth}px` }, // Add this
  }}
>

        <Toolbar />
      
        <Typography variant="body1" sx={{ mb: 2 }}>
         Hospital Management System
        </Typography>

         <Outlet />
         <ToastContainer position="top-right" autoClose={3000} />

      </Box>
    </Box>
  );
};

export default  ReceptionistDashboard;
