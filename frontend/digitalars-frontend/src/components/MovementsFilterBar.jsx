import { useState } from 'react';

import {
  Box,
  Button,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import {
  FilterListOutlined,
  CloseOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
} from '@mui/icons-material';

/**
 * Opciones disponibles para el filtro de tipo de movimiento.
 *
 * Los valores coinciden con el enum TransactionType del backend:
 * Deposit (1), TransferIn (2), TransferOut (3).
 */
const TRANSACTION_TYPE_OPTIONS = [
  { value: '', label: 'Todos los tipos' },
  { value: 'Deposit', label: 'Depósito' },
  { value: 'TransferIn', label: 'Transferencia recibida' },
  { value: 'TransferOut', label: 'Transferencia enviada' },
];

/**
 * Barra de filtros para la página de Movimientos.
 *
 * Permite al usuario filtrar transacciones por:
 * - Tipo de movimiento (select)
 * - Rango de fechas (fecha desde / hasta)
 * - Monto mínimo y máximo (colapsable, "Más filtros")
 *
 * @param {{ filters: Object, onFilterChange: Function }} props
 */
function MovementsFilterBar({ filters, onFilterChange }) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const hasActiveFilters =
    filters.type ||
    filters.fromDate ||
    filters.toDate ||
    filters.minAmount ||
    filters.maxAmount;

  /**
   * Actualiza un campo del filtro y notifica al componente padre.
   */
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  /**
   * Reinicia todos los filtros a su estado inicial.
   */
  const handleClearFilters = () => {
    onFilterChange({
      type: '',
      fromDate: '',
      toDate: '',
      minAmount: '',
      maxAmount: '',
    });
    setShowMoreFilters(false);
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Fila principal de filtros */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap',
          gap: 1.5,
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        {/* Select de tipo de movimiento */}
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: '100%', sm: 145, md: 155 },
            maxWidth: { sm: 170 },
            '& .MuiInputBase-root': {
              borderRadius: 2,
              bgcolor: 'background.paper',
              fontSize: '0.84rem',
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.84rem',
            },
            '& .MuiSelect-select': {
              py: '7.5px',
            },
          }}
        >
          <InputLabel id="filter-type-label">Tipo</InputLabel>
          <Select
            labelId="filter-type-label"
            id="filter-type"
            value={filters.type}
            label="Tipo"
            onChange={(e) => handleChange('type', e.target.value)}
          >
            {TRANSACTION_TYPE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.84rem' }}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Fecha desde */}
        <TextField
          size="small"
          label="Desde"
          type="date"
          value={filters.fromDate}
          onChange={(e) => handleChange('fromDate', e.target.value)}
          sx={{
            minWidth: { xs: '100%', sm: 125, md: 135 },
            maxWidth: { sm: 150 },
            '& .MuiInputBase-root': {
              borderRadius: 2,
              bgcolor: 'background.paper',
              fontSize: '0.84rem',
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.84rem',
            },
            '& .MuiInputBase-input': {
              py: '7.5px',
            },
          }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />

        {/* Fecha hasta */}
        <TextField
          size="small"
          label="Hasta"
          type="date"
          value={filters.toDate}
          onChange={(e) => handleChange('toDate', e.target.value)}
          sx={{
            minWidth: { xs: '100%', sm: 125, md: 135 },
            maxWidth: { sm: 150 },
            '& .MuiInputBase-root': {
              borderRadius: 2,
              bgcolor: 'background.paper',
              fontSize: '0.84rem',
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.84rem',
            },
            '& .MuiInputBase-input': {
              py: '7.5px',
            },
          }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />

        {/* Acciones: Más filtros + Limpiar */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            flexWrap: 'nowrap',
          }}
        >
          <Button
            size="small"
            variant="text"
            startIcon={
              showMoreFilters ? (
                <ExpandLessOutlined sx={{ fontSize: 18 }} />
              ) : (
                <ExpandMoreOutlined sx={{ fontSize: 18 }} />
              )
            }
            onClick={() => setShowMoreFilters((prev) => !prev)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8125rem',
              py: '4px',
              px: 1,
              whiteSpace: 'nowrap',
              color: 'text.secondary',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            Más filtros
          </Button>

          {hasActiveFilters && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<CloseOutlined sx={{ fontSize: 16 }} />}
              onClick={handleClearFilters}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                py: '3.5px',
                px: 1.25,
                whiteSpace: 'nowrap',
                borderRadius: 2,
                borderColor: 'error.light',
                bgcolor: 'rgba(211, 47, 47, 0.04)',
                '&:hover': {
                  bgcolor: 'rgba(211, 47, 47, 0.1)',
                  borderColor: 'error.main',
                },
              }}
            >
              Limpiar
            </Button>
          )}
        </Box>
      </Box>

      {/* Filtros avanzados colapsables: Monto mínimo y máximo */}
      <Collapse in={showMoreFilters}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            flexWrap: 'wrap',
            gap: 1.5,
            alignItems: { xs: 'stretch', sm: 'center' },
            mt: 1.5,
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <TextField
            size="small"
            label="Monto mín."
            type="number"
            value={filters.minAmount}
            onChange={(e) => handleChange('minAmount', e.target.value)}
            sx={{
              minWidth: { xs: '100%', sm: 125, md: 135 },
              maxWidth: { sm: 150 },
              '& .MuiInputBase-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
                fontSize: '0.84rem',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.84rem',
              },
              '& .MuiInputBase-input': {
                py: '7.5px',
              },
            }}
            slotProps={{
              input: {
                inputMode: 'decimal',
              },
              htmlInput: {
                min: 0,
                step: 'any',
              },
            }}
          />

          <TextField
            size="small"
            label="Monto máx."
            type="number"
            value={filters.maxAmount}
            onChange={(e) => handleChange('maxAmount', e.target.value)}
            sx={{
              minWidth: { xs: '100%', sm: 125, md: 135 },
              maxWidth: { sm: 150 },
              '& .MuiInputBase-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
                fontSize: '0.84rem',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.84rem',
              },
              '& .MuiInputBase-input': {
                py: '7.5px',
              },
            }}
            slotProps={{
              input: {
                inputMode: 'decimal',
              },
              htmlInput: {
                min: 0,
                step: 'any',
              },
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Filtrá por rango de monto para acotar los resultados.
            </Typography>
          </Box>
        </Box>
      </Collapse>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 1,
          }}
        >
          <FilterListOutlined
            sx={{ fontSize: 15, color: 'primary.main' }}
          />
          <Typography variant="caption" color="primary.main" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
            Filtros activos
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default MovementsFilterBar;
