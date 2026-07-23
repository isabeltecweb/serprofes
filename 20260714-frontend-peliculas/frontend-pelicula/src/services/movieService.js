const API_URL = "http://localhost:3000/api/peliculas";

async function request(url, options = {}) {
  const response = await fetch(url, options);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Error inesperado."
    );
  }

  return data;
}

export const getMovies = () =>
  request(API_URL);

export const createMovie = (movieData) =>
  request(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(movieData)
  });

export const updateMovie = (
  id,
  movieData
) =>
  request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(movieData)
  });

export const deleteMovie = (id) =>
  request(`${API_URL}/${id}`, {
    method: "DELETE"
  });