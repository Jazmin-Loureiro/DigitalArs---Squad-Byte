import { useEffect, useState, useMemo } from 'react';

import {
  Box,
  Typography,
} from '@mui/material';

import { ReceiptLongOutlined } from '@mui/icons-material';

import transactionService from '../services/transactionService';
import MovementsFilterBar from '../components/MovementsFilterBar';
import MovementsTable from '../components/MovementsTable';
import FeedbackSnackbar from '../components/FeedbackSnackbar';

/**
 * Página de Movimientos (HU-27).
 *
 * Muestra el historial completo de transacciones del usuario
 * con filtros por tipo, rango de fechas y monto, ordenamiento
 * por fecha/monto y paginación conectada al backend.
 */
function MovementsPage() {
  // ── Estado de datos ───────────────────────────────────────
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ── Paginación (page es 0-indexed para MUI TablePagination) ─
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ── Filtros ───────────────────────────────────────────────
  const [filters, setFilters] = useState({
    type: '',
    fromDate: '',
    toDate: '',
    minAmount: '',
    maxAmount: '',
  });

  // ── Ordenamiento (client-side dentro de la página actual) ──
  const [sortField, setSortField] = useState('createdDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // ── Notificaciones ────────────────────────────────────────
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  useEffect(() => {
    let ignore = false;

    const loadTransactions = async () => {
      try {
        setLoading(true);

        // El backend usa paginación 1-indexed; MUI TablePagination
        // usa 0-indexed, por lo que sumamos 1.
        const data = await transactionService.getMyTransactions(
          page + 1,
          rowsPerPage,
          filters,
        );

        if (!ignore) {
          const items = data.items ?? [];
          const total = data.totalCount ?? data.totalItems ?? items.length;

          setTransactions(items);
          setTotalCount(total);
        }
      } catch {
        if (!ignore) {
          setTransactions([]);
          setTotalCount(0);
          setSnackbar({
            open: true,
            message: 'No pudimos consultar tus movimientos en este momento.',
            severity: 'error',
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      ignore = true;
    };
  }, [page, rowsPerPage, filters]);

  /**
   * Aplica ordenamiento client-side sobre la página actual.
   *
   * Cuando el usuario clickea una cabecera de columna ordenable
   * se alterna la dirección; si cambia de campo se resetea a 'desc'.
   */
  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  /**
   * Los movimientos ordenados se calculan con useMemo para
   * evitar reordenamientos innecesarios en cada render.
   */
  const sortedTransactions = useMemo(() => {
    if (!transactions.length) return transactions;

    const sorted = [...transactions].sort((a, b) => {
      let comparison = 0;

      if (sortField === 'createdDate') {
        comparison = new Date(a.createdDate) - new Date(b.createdDate);
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [transactions, sortField, sortDirection]);

  /**
   * Al cambiar los filtros se resetea la paginación a la
   * primera página para que el usuario no quede en una
   * página vacía.
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1100,
        mx: 'auto',
        px: { xs: 2, md: 4 },
        pt: { xs: 3, md: 4 },
        pb: { xs: 3, md: 4 },
      }}
    >
      {/* Encabezado de página */}
      <Box
        sx={{
          mb: { xs: 4, md: 3 },
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          sx={{
            mb: { xs: 0, md: 1 },
            textAlign: 'left',
          }}
        >
          Movimientos
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            display: { xs: 'none', md: 'block' },
            textAlign: 'left',
          }}
        >
          Explorá tu historial completo de operaciones.
        </Typography>
      </Box>

      {/* Card contenedora — misma estética que AdminPage */}
      <Box>
        {/* Barra de filtros */}
        <MovementsFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Tabla de movimientos */}
        <MovementsTable
          transactions={sortedTransactions}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onSortChange={handleSortChange}
        />
      </Box>

      {/* Notificaciones de error */}
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}

export default MovementsPage;