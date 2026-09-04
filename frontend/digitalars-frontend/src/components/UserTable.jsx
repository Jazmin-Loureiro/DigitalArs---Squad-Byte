import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
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
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: "grey.50" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: "#1E3A5F" }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#1E3A5F" }}>
              Usuario
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#1E3A5F" }}>
              Email
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#1E3A5F" }}>
              Rol
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "#1E3A5F" }}>
              Estado
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: "#1E3A5F" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableSkeleton rows={rowsPerPage || 5} columns={6} />
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                <Typography color="text.secondary">
                  No se encontraron usuarios registrados.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.map((u) => {
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
                    bgcolor: isInactive ? "action.hover" : "inherit",
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>#{u.id}</TableCell>
                  <TableCell>
                    {u.firstName} {u.lastName} {isSelf && "(Tú)"}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.roleName || (isAdmin ? "Admin" : "Regular")}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        bgcolor: isAdmin ? "primary.dark" : "grey.200",
                        color: isAdmin ? "#FFFFFF" : "text.primary",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.isActive ? "Activo" : "Inactivo"}
                      size="small"
                      color={u.isActive ? "success" : "default"}
                      variant={u.isActive ? "filled" : "outlined"}
                      sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                    />
                  </TableCell>
                  <TableCell align="right">
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

      <TablePaginationFooter
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </TableContainer>
  );
}

export default UserTable;
