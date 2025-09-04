import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Drawer } from "@mui/material";
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
}

const Sidebar = ({ selectedMenu, onMenuSelect, menuItems }: SidebarProps) => {
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
    </Drawer>
  );
};

export default Sidebar;
