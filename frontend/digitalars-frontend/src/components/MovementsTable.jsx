import {
  Box,
  Paper,
  Skeleton,
  TableSortLabel,
  Typography,
} from '@mui/material';

import { InboxOutlined } from '@mui/icons-material';

import TablePaginationFooter from './TablePaginationFooter';

import {
  formatCurrency,
  getTransactionPresentation,
  getTransactionTitle,
  getTransactionSubtext,
} from '../utils/transactionUtils';

/**
 * Panel de movimientos del usuario con diseño de lista moderna (estilo tarjeta/items).
 *
 * Muestra cada transacción según el diseño solicitado:
 * - Ícono circular (badge con borde y fondo suaves).
 * - Título principal: Tipo de movimiento + destinatario si es el caso (ej. "Transferencia a Lucio", "Depósito").
 * - Subtexto: Concepto • Fecha (ej. "Varios • 01 Sept, 10:04", "pago • Hoy, 12:40 p. m.").
 * - Monto: Alineado a la derecha con signo y color adecuado.
 *
 * Mantiene ordenamiento por fecha/monto, paginación y estados de carga/vacío.
 *
 * @param {Object} props
 * @param {Array} props.transactions Lista de movimientos de la página actual.
 * @param {number} props.totalCount Total de movimientos sin paginar.
 * @param {number} props.page Página actual (0-indexed para MUI TablePagination).
 * @param {number} props.rowsPerPage Filas por página.
 * @param {boolean} props.loading Indica si se están cargando datos.
 * @param {string} props.sortField Campo de ordenamiento actual ('createdDate' | 'amount').
 * @param {string} props.sortDirection Dirección de orden ('asc' | 'desc').
 * @param {Function} props.onPageChange Callback de cambio de página.
 * @param {Function} props.onRowsPerPageChange Callback de cambio de filas por página.
 * @param {Function} props.onSortChange Callback de cambio de ordenamiento.
 */
function MovementsTable({
  transactions,
  totalCount,
  page,
  rowsPerPage,
  loading,
  sortField,
  sortDirection,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {/* Cabecera de ordenamiento y conteo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          py: 1.5,
          bgcolor: 'grey.50',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ color: '#1E3A5F' }}
        >
          Historial de movimientos ({totalCount})
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TableSortLabel
            active={sortField === 'createdDate'}
            direction={sortField === 'createdDate' ? sortDirection : 'desc'}
            onClick={() => onSortChange('createdDate')}
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: sortField === 'createdDate' ? '#1E3A5F' : 'text.secondary',
              '&.Mui-active': { color: '#1E3A5F' },
              '& .MuiTableSortLabel-icon': { color: '#1E3A5F !important' },
            }}
          >
            Fecha
          </TableSortLabel>

          <TableSortLabel
            active={sortField === 'amount'}
            direction={sortField === 'amount' ? sortDirection : 'desc'}
            onClick={() => onSortChange('amount')}
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: sortField === 'amount' ? '#1E3A5F' : 'text.secondary',
              '&.Mui-active': { color: '#1E3A5F' },
              '& .MuiTableSortLabel-icon': { color: '#1E3A5F !important' },
            }}
          >
            Monto
          </TableSortLabel>
        </Box>
      </Box>

      {/* Lista de movimientos / Skeleton / Vacío */}
      <Box>
        {loading ? (
          /* Estado de carga con Skeleton */
          Array.from({ length: rowsPerPage || 5 }).map((_, idx) => (
            <Box
              key={`movement-skeleton-${idx}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: { xs: 2, sm: 3 },
                py: 2,
                borderBottom:
                  idx < (rowsPerPage || 5) - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  width: '60%',
                }}
              >
                <Skeleton
                  variant="circular"
                  width={44}
                  height={44}
                  animation="wave"
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={22}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={16}
                    animation="wave"
                  />
                </Box>
              </Box>
              <Skeleton
                variant="text"
                width={80}
                height={24}
                animation="wave"
              />
            </Box>
          ))
        ) : transactions.length === 0 ? (
          /* Estado vacío */
          <Box sx={{ py: 6, textAlign: 'center', px: 2 }}>
            <InboxOutlined
              sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}
            />
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{ color: '#1E3A5F' }}
            >
              No se encontraron movimientos
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Probá ajustando los filtros o realizá una operación para verla
              reflejada aquí.
            </Typography>
          </Box>
        ) : (
          /* Items de movimientos (Estilo imagen 2) */
          transactions.map((tx, index) => {
            const presentation = getTransactionPresentation(tx);
            const TransactionIcon = presentation.Icon;
            const title = getTransactionTitle(tx);
            const subtext = getTransactionSubtext(tx);

            return (
              <Box
                key={tx.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: { xs: 2, sm: 3 },
                  py: 1.8,
                  borderBottom:
                    index < transactions.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {/* Sección izquierda: Ícono badge + Título / Subtítulo */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    minWidth: 0,
                    pr: 2,
                  }}
                >
                  {/* Badge circular con borde y color tenue */}
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '2px solid',
                      borderColor:
                        presentation.borderColor || presentation.iconColor,
                      bgcolor: presentation.iconBackground,
                      color: presentation.iconColor,
                    }}
                  >
                    <TransactionIcon sx={{ fontSize: 22 }} />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    {/* Título principal (Tipo + Destinatario) */}
                    <Typography
                      variant="body1"
                      fontWeight={700}
                      noWrap
                      sx={{
                        color: '#1E3A5F',
                        fontSize: { xs: '0.9rem', sm: '0.95rem' },
                        lineHeight: 1.3,
                      }}
                    >
                      {title}
                    </Typography>

                    {/* Subtexto (Concepto • Fecha) */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                        mt: 0.2,
                      }}
                    >
                      {subtext}
                    </Typography>
                  </Box>
                </Box>

                {/* Sección derecha: Monto aparte */}
                <Typography
                  variant="body1"
                  fontWeight={700}
                  sx={{
                    color: presentation.amountColor,
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.95rem', sm: '1rem' },
                    ml: 2,
                    flexShrink: 0,
                    textAlign: 'right',
                  }}
                >
                  {presentation.sign}
                  {formatCurrency(tx.amount)}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>

      {/* Paginación al pie */}
      <TablePaginationFooter
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}

export default MovementsTable;
