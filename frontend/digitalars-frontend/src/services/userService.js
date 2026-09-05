import api from "./api";

const userService = {
  /**
   * Obtiene la lista paginada de usuarios con filtro opcional de búsqueda.
   * @param {number} page Número de página (1-based)
   * @param {number} pageSize Registros por página
   * @param {string} search Filtro por nombre o email
   */
  async getUsers(page = 1, pageSize = 10, search = "") {
    const params = { page, pageSize };
    if (search && search.trim()) {
      params.search = search.trim();
    }
    const response = await api.get("/users", { params });
    return response.data;
  },

  /**
   * Da de alta un nuevo usuario.
   * @param {Object} userData { firstName, lastName, email, password, roleId }
   */
  async createUser(userData) {
    const response = await api.post("/users", userData);
    return response.data;
  },

  /**
   * Actualiza datos de un usuario existente.
   * @param {number} id ID del usuario
   * @param {Object} userData { firstName, lastName, email, roleId }
   */
  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Da de baja a un usuario.
   * @param {number} id ID del usuario
   */
  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async getMyProfile() {
    const response = await api.get("/users/me");
    return response.data;
  },

  async updateMyProfile(userData) {
    const response = await api.put("/users/me", userData);
    return response.data;
  },
};

export default userService;
