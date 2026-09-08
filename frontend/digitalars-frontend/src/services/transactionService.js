import api from './api';

/**
 * Servicio encargado de consultar los movimientos
 * del usuario autenticado.
 */
const transactionService = {
  /**
   * Obtiene las transacciones del usuario ordenadas por fecha
   * desde el endpoint implementado en HU-17.
   *
   * @param {number} page Página solicitada (1-indexed).
   * @param {number} pageSize Cantidad de movimientos por página.
   * @param {Object} [filters={}] Filtros opcionales para la consulta.
   * @param {string} [filters.type] Tipo de movimiento (Deposit, TransferIn, TransferOut).
   * @param {string} [filters.fromDate] Fecha inicio (formato YYYY-MM-DD).
   * @param {string} [filters.toDate] Fecha fin (formato YYYY-MM-DD).
   * @param {number} [filters.minAmount] Monto mínimo.
   * @param {number} [filters.maxAmount] Monto máximo.
   * @returns {Promise<Object>} Resultado paginado de transacciones.
   */
  async getMyTransactions(page = 1, pageSize = 10, filters = {}) {
    const params = { page, pageSize };

    // Solo incluimos los filtros que tengan valor definido
    // para que la URL no contenga parámetros vacíos.
    if (filters.type) params.type = filters.type;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
    if (filters.minAmount) params.minAmount = filters.minAmount;
    if (filters.maxAmount) params.maxAmount = filters.maxAmount;

    const response = await api.get('/transactions/me', { params });

    return response.data;
  },
};

export default transactionService;