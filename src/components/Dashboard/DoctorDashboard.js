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

const DoctorDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
const navigate = useNavigate();

const handleNav = (path) => {
  const token = localStorage.getItem('jwt');
  if (token && token !== "null") {
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
    <Box sx={{ flexGrow: 1 }}>
      <List>
        {/* Home */}
        <ListItem button  sx={{ px: 3, cursor: 'pointer' }} onClick={() => handleNav("/doctor-dashboard/home")}>
          <ListItemIcon sx={{ minWidth: 36 }}><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItem>
     

        {/* Profile */}
        

  



        



      

    

    


        {/* Settings */}
        
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
  <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {isMobile && (
        <IconButton color="inherit" onClick={() => setMobileOpen(prev => !prev)} edge="start">
          <MenuIcon />
        </IconButton>
      )}

      {!isMobile && (
        <>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2967/2967350.png"
            alt="Hospital Logo"
            style={{ width: 40, height: 40 }}
          />
          <Typography variant="h6" noWrap>
            Hospital Management System
          </Typography>
        </>
      )}
    </Box>
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
            display: { xs: 'block', md: 'block', textAlign: 'center', p: 2, pt: 6  },
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
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default  DoctorDashboard;
