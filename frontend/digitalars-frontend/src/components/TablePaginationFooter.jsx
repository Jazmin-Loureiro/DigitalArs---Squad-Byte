import { TablePagination } from '@mui/material';

/**
 * Paginación reutilizable para tablas y listados.
 *
 * En mobile se reduce el espacio entre controles para evitar
 * overflow horizontal y mantener toda la navegación visible.
 */
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
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        borderTop: '1px solid',
        borderColor: 'divider',

        '& .MuiTablePagination-toolbar': {
          minHeight: 52,
          px: { xs: 0, sm: 2 },
          gap: { xs: 0, sm: 1 },
        },

        '& .MuiTablePagination-spacer': {
          display: { xs: 'none', sm: 'block' },
          flex: { sm: '1 1 100%' },
        },

        '& .MuiTablePagination-selectLabel': {
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
          color: 'text.secondary',
          whiteSpace: 'nowrap',
          ml: { xs: 0, sm: 0 },
        },

        '& .MuiTablePagination-select': {
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
        },

        '& .MuiTablePagination-selectIcon': {
          right: { xs: 0, sm: 4 },
        },

        '& .MuiTablePagination-displayedRows': {
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
          color: 'text.secondary',
          whiteSpace: 'nowrap',
          ml: { xs: 1, sm: 2 },
        },

        '& .MuiTablePagination-actions': {
          display: 'flex',
          flexShrink: 0,
          ml: { xs: 0.5, sm: 2 },

          '& .MuiIconButton-root': {
            width: { xs: 36, sm: 44 },
            height: { xs: 36, sm: 44 },
            p: { xs: 0.5, sm: 1 },
          },
        },
      }}
    />
  );
}

export default TablePaginationFooter;