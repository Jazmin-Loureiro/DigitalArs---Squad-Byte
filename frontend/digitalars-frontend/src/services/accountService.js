import api from './api';

/**
 * Servicio encargado de las operaciones relacionadas con la cuenta
 * del usuario autenticado.
 *
 * Centralizar estas llamadas evita que las páginas conozcan detalles
 * de Axios o de las rutas específicas de la API.
 */
const accountService = {
  /**
   * Obtiene la cuenta asociada al usuario autenticado.
   *
   * El backend identifica al usuario a partir del JWT que api.js
   * agrega automáticamente al header Authorization.
   *
   * @returns {Promise<Object>} Cuenta del usuario con saldo y estado.
   */
  async getMyAccount() {
    const response = await api.get('/accounts/me');

    return response.data;
  },
};

export default accountService;