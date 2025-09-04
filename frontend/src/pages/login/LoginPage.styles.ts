import { SxProps, Theme } from "@mui/material/styles";

const styles: { [key: string]: SxProps<Theme> } = {
  container: {
    mt: 10,
    p: 4,
    borderRadius: 3,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    backgroundColor: "background.paper",
  },
  title: {
    mb: 3,
  },
};

export default styles;
