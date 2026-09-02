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
  /**
   * Deposita dinero en la cuenta del usuario autenticado.
   *
   * El backend obtiene la cuenta a partir del JWT y se encarga de
   * actualizar el saldo y registrar la transacción correspondiente.
   *
   * @param {number} amount Monto a depositar.
   * @param {string} concept Concepto opcional del depósito.
   * @returns {Promise<Object>} Resultado de la operación y nuevo saldo.
   */
  async deposit(amount, concept = '') {
    const response = await api.post('/accounts/deposit', {
      amount,
      concept,
    });

    return response.data;
  },
};

export default accountService;