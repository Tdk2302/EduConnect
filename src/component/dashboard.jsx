import * as React from "react";
import PropTypes from "prop-types";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import PeopleIcon from "@mui/icons-material/People"; // Icon cho Users
import ManageUser from "./ManageUser"; // Import ManageUser

const drawerWidth = 240;

const NAVIGATION = [
  { title: "Dashboard", icon: <DashboardIcon /> },
  { title: "Orders", icon: <ShoppingCartIcon /> },
  { title: "Users", icon: <PeopleIcon /> }, // Thêm mục Users
  { divider: true },
  { header: "Analytics" },
  { title: "Reports", icon: <BarChartIcon /> },
  { title: "Sales", icon: <DescriptionIcon /> },
  { title: "Traffic", icon: <DescriptionIcon /> },
  { title: "Integrations", icon: <LayersIcon /> },
];

function DemoPageContent({ currentPage }) {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4">Nội dung Dashboard: {currentPage}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  currentPage: PropTypes.string.isRequired,
};

function DashboardLayoutBasic() {
  const [currentPage, setCurrentPage] = React.useState("Dashboard");

  const renderContent = () => {
    switch (currentPage) {
      case "Users":
        return <ManageUser />;
      default:
        return <DemoPageContent currentPage={currentPage} />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {NAVIGATION.map((item, index) => {
              if (item.divider) return <Divider key={index} />;
              if (item.header)
                return (
                  <ListItem key={index}>
                    <Typography variant="caption" sx={{ ml: 2 }}>
                      {item.header}
                    </Typography>
                  </ListItem>
                );
              return (
                <ListItem
                  button
                  key={index}
                  onClick={() => setCurrentPage(item.title)}
                  selected={currentPage === item.title} 
                  disableGutters 
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}

export default DashboardLayoutBasic;
