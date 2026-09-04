import { TablePagination } from "@mui/material";

function TablePaginationFooter({
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25],
}) {
  return (
    <TablePagination
      component="div"
      count={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={rowsPerPageOptions}
      labelRowsPerPage="Filas por página:"
      labelDisplayedRows={({ from, to, count }) =>
        `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
      }
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
          fontSize: "0.85rem",
          color: "text.secondary",
        },
      }}
    />
  );
}

export default TablePaginationFooter;
