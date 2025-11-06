import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Divider,
  Avatar,
  ListItemIcon,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  LocalPharmacy as PharmacyIcon,
} from "@mui/icons-material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { useTheme } from "@mui/material/styles";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const drawerWidth = 260;

const InventoryManagerDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    const token = localStorage.getItem("jwt");
    if (token && token !== "null") {
      navigate(path);
      if (isMobile) setMobileOpen(false);
    } else {
      toast.error("Please login first.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const menuItems = [
    {
      text: "Inventory Form",
      icon: <MedicalInformationIcon />,
      path: "/inventoryManager-dashboard/InventoryForm",
    },
    {
      text: "Inventory List",
      icon: <PharmacyIcon />,
      path: "/inventoryManager-dashboard/InventoryList",
    },
    {
      text: "Record Transaction",
      icon: <ReceiptLongIcon />,
      path: "/inventoryManager-dashboard/RecordTransactionForm",
    },
    {
      text: "Transaction History",
      icon: <EventNoteIcon />,
      path: "/inventoryManager-dashboard/TransactionHistoryForm",
    },
  ];

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Profile Section */}
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Avatar
          alt="Inventory Manager"
          src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
          sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
        />
        <Typography variant="h6" fontWeight={600}>
          Inventory Manager
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Warehouse Control
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Menu List */}
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.text}
                button
                sx={{
                  px: 3,
                  cursor: "pointer",
                  borderRadius: "8px",
                  mx: 1,
                  mb: 1,
                  backgroundColor: isActive
                    ? "rgba(128,0,128,0.1)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(128,0,128,0.15)",
                  },
                  color: isActive ? "purple" : "inherit",
                }}
                onClick={() => handleNav(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? "purple" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Logout Section */}
      <Box sx={{ textAlign: "center", p: 2, borderTop: "1px solid #e0e0e0" }}>
        <ListItem
          button
          sx={{
            justifyContent: "center",
            color: "red",
            "&:hover": { backgroundColor: "rgba(255,0,0,0.1)" },
          }}
          onClick={handleLogout}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "red" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          backgroundColor: "purple",
          ml: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setMobileOpen((prev) => !prev)}
                edge="start"
              >
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

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              borderRight: "1px solid #e0e0e0",
              pt: "64px",
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
          width: "100%",
        }}
      >
        <Toolbar />
        <Typography variant="body1" sx={{ mb: 2 }}>
          Welcome to the Inventory Manager Dashboard
        </Typography>
        <Outlet />
      </Box>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default InventoryManagerDashboard;
