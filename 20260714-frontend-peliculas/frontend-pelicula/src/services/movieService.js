// ==========================================================
// movieService.js
// Servicio encargado de hacer las peticiones HTTP al Backend
// ==========================================================

const API_URL = "http://localhost:3000/api/peliculas";

// 1. Obtener todas las películas (GET)
export const getMovies = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("No se pudo conectar con el servidor.");
  }
  return await response.json();
};

// 2. Crear una nueva película (POST)
export const createMovie = async (movieData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieData),
  });

  const data = await response.json();

  if (!response.ok) {
    // Lanza el mensaje devuelto por el Backend (ej: "Esta película ya existe en el catálogo.")
    throw new Error(data.error || "Error al crear la película.");
  }

  return data;
};

// 3. Actualizar una película (PUT)
export const updateMovie = async (id, movieData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieData),
  });

  const data = await response.json();

  if (!response.ok) {
    // Lanza el mensaje devuelto por el Backend
    throw new Error(data.error || "Error al actualizar la película.");
  }

  return data;
};

// 4. Eliminar una película (DELETE)
export const deleteMovie = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al eliminar la película.");
  }

  return data;
};