import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemText,
  CssBaseline, Divider, IconButton, useMediaQuery, ListItemIcon
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  EventNote as DailyReportIcon,
  Assignment as ProcedureIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, Outlet } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const drawerWidth = 260;

const NurseDashboard = () => {
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
      <Box sx={{ textAlign: 'center', p: 2, pt: 3 }}></Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ flexGrow: 1 }}>
        <List>

          {/* Nurse IPD Admission List */}
          <ListItem button sx={{ px: 3 }} onClick={() => handleNav("/nurse-dashboard/NurseIPDAdmissionList")}>
            <ListItemIcon sx={{ minWidth: 36 }}><HomeIcon /></ListItemIcon>
            <ListItemText primary="IPD Admissions" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItem>

          {/* Daily Reports */}
          <ListItem button sx={{ px: 3 }} onClick={() => handleNav("/nurse-dashboard/ViewDailyReports")}>
            <ListItemIcon sx={{ minWidth: 36 }}><DailyReportIcon /></ListItemIcon>
            <ListItemText primary="Daily Reports" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItem>

          {/* Scheduled Procedures */}
          <ListItem button sx={{ px: 3 }} onClick={() => handleNav("/nurse-dashboard/NurseScheduledProcedures")}>
            <ListItemIcon sx={{ minWidth: 36 }}><ProcedureIcon /></ListItemIcon>
            <ListItemText primary="Scheduled Procedures" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItem>

          {/* Settings */}
          <ListItem button sx={{ px: 3 }} onClick={() => isMobile && setMobileOpen(false)}>
            <ListItemIcon sx={{ minWidth: 36 }}><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItem>

        </List>
      </Box>
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
          <Box>
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
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
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
          ml: { md: `${drawerWidth}px` },
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

export default NurseDashboard;
