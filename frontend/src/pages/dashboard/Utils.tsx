import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Invoice } from "./Types";

// Colunas de Fornecedores
export const getUserColumns = (): GridColDef[] => [
  { field: "id", headerName: "ID", width: 80 },
  { field: "name", headerName: "Nome", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "role", headerName: "Role", width: 120 },
];


// Colunas de Notas
export const getInvoiceColumns = (
  role: string,
  onView?: (id: number) => void,
  onEdit?: (id: number) => void,
  onDelete?: (id: number) => void
): GridColDef[] => [
  { field: "id", headerName: "ID", width: 80 },
  { field: "title", headerName: "Título", flex: 1 },
  { field: "reference_month", headerName: "Referência", width: 150 },
  ...(role === "admin" ? [{ field: "user_id", headerName: "Fornecedor ID", width: 150 }] : []),
  {
    field: "file_path",
    headerName: "Arquivo",
    flex: 1,
    renderCell: (params) => (
      <a
        href={`http://localhost:5000/${params.value}`}
        target="_blank"
        rel="noreferrer"
      >
        Ver PDF
      </a>
    ),
  },
  { field: "observations", headerName: "Observações", flex: 1 },
  {
    field: "actions",
    headerName: "Ações",
    width: 220,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<Invoice>) => (
      <div style={{ display: "flex", gap: 8 }}>
        {onView && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ fontSize: "0.60rem" }} // texto menor
            onClick={() => onView(params.row.id)}
          >
            Detalhes
          </Button>
        )}
        {onEdit && (
          <Button
            variant="contained"
            color="warning"
            size="small"
            sx={{ fontSize: "0.60rem"}}
            onClick={() => onEdit(params.row.id)}
          >
            Editar
          </Button>
        )}
        {onDelete && (
          <Button
            variant="contained"
            color="error"
            size="small"            
            sx={{ fontSize: "0.60rem"}}
            onClick={() => onDelete(params.row.id)}
          >
            Deletar
          </Button>
        )}
      </div>
    ),
  },
];
