import { DialogTitle, DialogContent, DialogActions, Box, Typography, Button, Link } from "@mui/material";
import { Invoice } from "./Types";

interface InvoiceDetailsProps {
  invoice: Invoice;
  onClose: () => void;
}

const InvoiceDetails = ({ invoice, onClose }: InvoiceDetailsProps) => {
  return (
    <>
      <DialogTitle>Detalhes da Nota Fiscal</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle2" color="textSecondary">ID:</Typography>
            <Typography>{invoice.id}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle2" color="textSecondary">Título:</Typography>
            <Typography>{invoice.title}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle2" color="textSecondary">Referência:</Typography>
            <Typography>{invoice.referenceMonth}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle2" color="textSecondary">Fornecedor ID:</Typography>
            <Typography>{invoice.userId}</Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="subtitle2" color="textSecondary">Observações:</Typography>
            <Typography>{invoice.observations || "-"}</Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="subtitle2" color="textSecondary">Arquivo:</Typography>
            <Link href={`http://localhost:5000/uploads/${invoice.filePath}`} target="_blank" rel="noreferrer">
              Ver PDF
            </Link>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>Fechar</Button>
      </DialogActions>
    </>
  );
};

export default InvoiceDetails;
