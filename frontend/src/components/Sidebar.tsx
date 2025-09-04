import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Drawer, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import styles from "./Sidebar.styles";

export interface SidebarItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  selectedMenu: string;
  onMenuSelect: (menu: string) => void;
  menuItems: SidebarItem[];
  drawerWidth?: number;
  onLogout: () => void;
}

const Sidebar = ({ selectedMenu, onMenuSelect, menuItems, onLogout}: SidebarProps) => {

  return (
    <Drawer variant="permanent" sx={styles.drawer}>
      <Typography variant="h6" sx={styles.title}>
        Menu
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.value} disablePadding>
            <ListItemButton
              selected={selectedMenu === item.value}
              onClick={() => onMenuSelect(item.value)}
              sx={styles.listItemButton}
            >
              {item.icon && (
                <ListItemIcon sx={styles.listItemIcon}>{item.icon}</ListItemIcon>
              )}
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: "auto" }} />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={onLogout}
            sx={{ ...styles.listItemButton }}
          >
            <ListItemIcon sx={{...styles.listItemButton }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
