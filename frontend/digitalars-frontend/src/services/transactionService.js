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
   * @param {number} page Página solicitada.
   * @param {number} pageSize Cantidad de movimientos por página.
   * @returns {Promise<Object>} Resultado paginado de transacciones.
   */
  async getMyTransactions(page = 1, pageSize = 5) {
    const response = await api.get('/transactions/me', {
      params: {
        page,
        pageSize,
      },
    });

    return response.data;
  },
};

export default transactionService;