const drawerWidth = 220;

const styles = {
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      backgroundColor: "#354a5c",
      color: "#fff",
    },
  },
  title: {
    p: 2,
    textAlign: "center", 
  },
  listItemButton: {
    color: "#fff",
  },
  listItemIcon: {
    color: "#fff",
  },
};

export default styles;
