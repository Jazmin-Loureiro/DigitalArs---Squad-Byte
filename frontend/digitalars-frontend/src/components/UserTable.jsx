import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
} from "@mui/icons-material";

import ActionButton from "./ActionButton";
import TableSkeleton from "./TableSkeleton";
import TablePaginationFooter from "./TablePaginationFooter";

function UserTable({
  users,
  totalCount,
  page,
  rowsPerPage,
  loading,
  currentUserId,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}) {
  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <TableContainer sx={{ border: "none", overflowX: "auto" }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow
              sx={{ borderBottom: "1px solid", borderColor: "divider" }}
            >
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: "0.8125rem",
                  py: 1.5,
                  px: 1,
                }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: "0.8125rem",
                  py: 1.5,
                  px: 1,
                }}
              >
                Usuario
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: "0.8125rem",
                  py: 1.5,
                  px: 1,
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: "0.8125rem",
                  py: 1.5,
                  px: 1,
                }}
              >
                Rol
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: "0.8125rem",
                  py: 1.5,
                  px: 1,
                }}
              >
                Estado
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: "0.8125rem",
                  py: 1.5,
                  px: 1,
                }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeleton rows={rowsPerPage || 5} columns={6} />
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 6, border: "none" }}
                >
                  <Typography color="text.secondary">
                    No se encontraron usuarios registrados.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((u, index) => {
                const isAdmin =
                  u.roleName?.toLowerCase() === "admin" || u.roleId === 1;
                const isInactive = !u.isActive;
                const isSelf = u.id === currentUserId;

                return (
                  <TableRow
                    key={u.id}
                    hover
                    sx={{
                      opacity: isInactive ? 0.6 : 1,
                      borderBottom:
                        index < users.length - 1 ? "1px solid" : "none",
                      borderColor: "divider",
                      transition: "background-color 0.15s ease",
                      "& td": { borderBottom: "none" }, // delegamos la línea al TableRow
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.84rem",
                        py: 1.5,
                        px: 1,
                      }}
                    >
                      #{u.id}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.84rem",
                        py: 1.5,
                        px: 1,
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    >
                      {u.firstName} {u.lastName} {isSelf && "(Tú)"}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.84rem",
                        py: 1.5,
                        px: 1,
                        color: "text.secondary",
                      }}
                    >
                      {u.email}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 1 }}>
                      <Chip
                        label={u.roleName || (isAdmin ? "Admin" : "Regular")}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.72rem",
                          height: 22,
                          bgcolor: isAdmin
                            ? "primary.main"
                            : "background.subtle",
                          color: isAdmin
                            ? "primary.contrastText"
                            : "text.primary",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 1 }}>
                      <Chip
                        label={u.isActive ? "Activo" : "Inactivo"}
                        size="small"
                        color={u.isActive ? "success" : "default"}
                        variant={u.isActive ? "filled" : "outlined"}
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.72rem",
                          height: 22,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ py: 1.5, px: 1, whiteSpace: "nowrap" }}
                    >
                      <ActionButton
                        title={
                          isInactive
                            ? "No se puede editar un usuario inactivo"
                            : "Editar usuario"
                        }
                        color="primary"
                        disabled={isInactive}
                        onClick={() => onEdit(u)}
                      >
                        <EditIcon fontSize="small" />
                      </ActionButton>

                      <ActionButton
                        title={
                          isSelf
                            ? "No podés darte de baja a vos mismo"
                            : isInactive
                              ? "El usuario ya se encuentra inactivo"
                              : "Dar de baja"
                        }
                        color="error"
                        disabled={isInactive || isSelf}
                        onClick={() => onDelete(u)}
                      >
                        <DeleteIcon fontSize="small" />
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginador reutilizable alineado al pie */}
      <TablePaginationFooter
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Box>
  );
}

export default UserTable;
