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
          justifyContent: { xs: 'space-between', sm: 'flex-start' },
        },

        '& .MuiTablePagination-spacer': {
          display: { xs: 'none', sm: 'block' },
          flex: { sm: '1 1 100%' },
        },

        '& .MuiTablePagination-selectLabel': {
          display: { xs: 'none', sm: 'block' },
          fontSize: '0.85rem',
          color: 'text.secondary',
          whiteSpace: 'nowrap',
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
          ml: { xs: 0, sm: 2 },
        },

        '& .MuiTablePagination-actions': {
          display: 'flex',
          flexShrink: 0,
          ml: { xs: 0, sm: 2 },

          '& .MuiIconButton-root': {
            width: 44,
            height: 44,
            p: 1,
          },
        },
      }}
    />
  );
}

export default TablePaginationFooter;