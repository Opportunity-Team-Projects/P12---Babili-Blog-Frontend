import { authClient } from "./AuthService";

export default {
  // Kategorien abrufen
  getCategories() {
    return authClient.get("api/categories");
  },

  // Einzelne Kategorie abrufen
  getCategory(id) {
    return authClient.get(`api/categories/${id}`);
  },

  // Neue Kategorie erstellen
  createCategory(payload) {
    return authClient.post("api/categories", payload);
  },

  // Bestehende Kategorie aktualisieren
  updateCategory(id, payload) {
    return authClient.put(`api/categories/${id}`, payload);
  },

  // Kategorie löschen
  deleteCategory(id) {
    return authClient.delete(`api/categories/${id}`);
  }
};
