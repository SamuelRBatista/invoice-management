import { Card, CardContent, Typography } from "@mui/material";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const DashboardCard = ({ title, value, icon }: DashboardCardProps) => {
  return (  
      <Card sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="h4">{value}</Typography>
        </CardContent>
      </Card>    
  );
};

export default DashboardCard;
