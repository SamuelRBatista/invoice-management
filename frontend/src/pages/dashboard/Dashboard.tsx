import { useState, useEffect } from "react";
import { Box, Typography, Button, Dialog } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";

import DashboardCard from "../../components/DashboardCard";
import Sidebar, { SidebarItem } from "../../components/Sidebar";
import FornecedorForm from "../supplier/FornecedorForm";
import InvoiceForm from "../invoice/InvoiceForm";
import InvoiceDetails from "../invoice/InvoiceDetails";

import { useUsers } from "./hooks/useUsers";
import { useInvoices } from "./hooks/useInvoices";

import { getRole } from "../../utils/auth";
import { getUserColumns, getInvoiceColumns } from "./Utils";

import styles from "./DashboardPage.styles";
import api from "../../api/api"; 
import { Invoice } from "./Types";

const Dashboard = () => {
  const role = (getRole() as "admin" | "pj") || "pj";

  // Estados
  const [openUserForm, setOpenUserForm] = useState(false);
  const [openInvoiceForm, setOpenInvoiceForm] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  // Menu lateral
  const menuItems: SidebarItem[] =
    role === "admin"
      ? [
          { label: "Fornecedores", value: "fornecedores", icon: <PeopleIcon /> },
          { label: "Notas Fiscais", value: "notas", icon: <DescriptionIcon /> },
        ]
      : [{ label: "Minhas Notas", value: "minhasNotas", icon: <DescriptionIcon /> }];

  // Hooks de dados
  const { users, loading: usersLoading, refresh: refreshUsers } = useUsers(role === "admin");
  const { invoices, loading: invoicesLoading, refresh: refreshInvoices } = useInvoices(role);

  // Inicializa menu
  useEffect(() => {
    if (role === "admin") {
      setSelectedMenu("fornecedores");
    } else {
      setSelectedMenu("minhasNotas");
    }
  }, [role]);

  // Funções de ações
  const handleEdit = (id: number) => {
    setEditingInvoiceId(id);
    setOpenInvoiceForm(true);
  };

  const handleView = (id: number) => {
    const invoice = invoices.find((inv) => inv.id === id);
    if (invoice) setViewingInvoice(invoice);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente deletar esta nota fiscal?")) return;

    try {
      await api.delete(`/Invoices/${id}`);
      refreshInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  // Colunas
  const userColumns = getUserColumns();
  const invoiceColumns = getInvoiceColumns(role, handleView, handleEdit, handleDelete);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar
        selectedMenu={selectedMenu}
        onMenuSelect={setSelectedMenu}
        menuItems={menuItems}
      />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {/* Cards */}
        {role === "admin" && (
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <DashboardCard
              title="Total de Fornecedores"
              value={users.length}
              icon={<PeopleIcon />}
            />
            <DashboardCard
              title="Total de Notas Fiscais"
              value={invoices.length}
              icon={<DescriptionIcon />}
            />
          </Box>
        )}

        {/* Menu de Fornecedores */}
        {selectedMenu === "fornecedores" && role === "admin" && (
          <Box>
            <Button
              variant="contained"
              sx={styles.mainButton}
              onClick={() => setOpenUserForm(true)}
            >
              Cadastrar Fornecedor
            </Button>

            {openUserForm && (
              <FornecedorForm
                onClose={() => setOpenUserForm(false)}
                onSaved={refreshUsers}
              />
            )}

            <Box sx={{ height: 400, width: "100%", mt: 2 }}>
              <DataGrid
                rows={users}
                columns={userColumns}
                loading={usersLoading}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                disableRowSelectionOnClick
              />
            </Box>
          </Box>
        )}

        {/* Menu de Notas Fiscais */}
        {(selectedMenu === "notas" || selectedMenu === "minhasNotas") && (
          <Box>
            {role === "pj" && (
              <Button
                variant="contained"
                sx={styles.mainButton}
                onClick={() => setOpenInvoiceForm(true)}
              >
                Cadastrar Nota Fiscal
              </Button>
            )}

            {openInvoiceForm && (
              <InvoiceForm
                invoiceId={editingInvoiceId ?? undefined}
                onClose={() => {
                  setOpenInvoiceForm(false);
                  setEditingInvoiceId(null);
                }}
                onSaved={() => {
                  refreshInvoices();
                  setEditingInvoiceId(null);
                }}
              />
            )}

            <Box sx={{ height: 400, width: "100%", mt: 2 }}>
              <DataGrid
                rows={invoices}
                columns={invoiceColumns}
                loading={invoicesLoading}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                disableRowSelectionOnClick
              />
            </Box>
          </Box>
        )}

        {/* Modal de Detalhes da Nota */}
        <Dialog
          open={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          maxWidth="sm"
          fullWidth
        >
          {viewingInvoice && (
            <InvoiceDetails
              invoice={viewingInvoice}
              onClose={() => setViewingInvoice(null)}
            />
          )}
        </Dialog>
      </Box>
    </Box>
  );
};

export default Dashboard;
