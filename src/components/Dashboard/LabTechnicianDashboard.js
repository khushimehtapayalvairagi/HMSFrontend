// src/components/LabTechnicianDashboard.jsx
import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemText,
  CssBaseline, Divider, IconButton, useMediaQuery, ListItemIcon
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  People as PatientsIcon,
  Assignment as TestIcon,
  Event as AppointmentIcon,
  PendingActions as PendingIcon,
  DoneAll as CompletedIcon,
  CloudUpload as UploadIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

const drawerWidth = 260;

const LabTechnicianDashboard = () => {
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
      <Divider sx={{ my: 2 }} />
      <List>
        <ListItem button sx={{ px: 3 }} onClick={() => handleNav("/labTechnician-dashboard/dashboard")}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button sx={{ px: 3 }} onClick={() => handleNav("/labTechnician-dashboard/patients")}>
          <ListItemIcon><PatientsIcon /></ListItemIcon>
          <ListItemText primary="Patients" />
        </ListItem>

        <ListItem button sx={{ px: 3 }} onClick={() => handleNav("/labTechnician-dashboard/add-test")}>
          <ListItemIcon><TestIcon /></ListItemIcon>
          <ListItemText primary="Add Test Result" />
        </ListItem>

        <ListItem button sx={{ px: 3 }} onClick={() => handleNav("/labTechnician-dashboard/appointments")}>
          <ListItemIcon><AppointmentIcon /></ListItemIcon>
          <ListItemText primary="Appointments" />
        </ListItem>

        {/* <ListItem button sx={{ px: 3 }} onClick={() => handleNav("/labTechnician-dashboard/pending")}>
          <ListItemIcon><PendingIcon /></ListItemIcon>
          <ListItemText primary="Pending Tests" />
        </ListItem>

        <ListItem button sx={{ px: 3 }} onClick={() => handleNav("/labTechnician-dashboard/completed")}>
          <ListItemIcon><CompletedIcon /></ListItemIcon>
          <ListItemText primary="Completed Tests" />
        </ListItem> */}

        <ListItem button sx={{ px: 3 }} onClick={() => handleNav("/labTechnician-dashboard/upload-report")}>
          <ListItemIcon><UploadIcon /></ListItemIcon>
          <ListItemText primary="Upload Report" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: 'purple' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton color="inherit" onClick={() => setMobileOpen(prev => !prev)} edge="start">
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap>Lab Technician Dashboard</Typography>
          </Box>
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
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            paddingTop: '64px',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { md: `${drawerWidth}px` } }}>
        <Toolbar />
        <Outlet />
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default LabTechnicianDashboard;
