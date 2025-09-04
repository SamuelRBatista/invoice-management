import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface UtilProps {
  rows: any[];
  columns: GridColDef[];
}

const Util = ({ rows, columns }: UtilProps) => {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default Util;
