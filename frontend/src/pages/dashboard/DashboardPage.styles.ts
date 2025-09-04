const styles = {
  container: {
    mt: 5,
  },
  title: {
    mb: 3,
  },
  mainButton: {
    mb: 4,
    mt: 1,
    p:1,
    width:250, // ocupa toda a largura do container
    backgroundColor: "#354a5c",
    color: "#fff",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#667b8e", // tom de azul mais escuro no hover
    },
  },
  tablePaper: {
    mt: 2,
    overflow: "hidden",
    borderRadius: 2,
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
  },
  tableHead: {
    backgroundColor: "#1976d2",
    "& .MuiTableCell-root": {
      color: "#fff",
      fontWeight: "bold",
    },
  },
  tableRow: {
    "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" },
    "&:hover": { backgroundColor: "#e3f2fd" },
  },
  tableCell: {
    padding: "12px 16px",
  },
  
};

export default styles;
