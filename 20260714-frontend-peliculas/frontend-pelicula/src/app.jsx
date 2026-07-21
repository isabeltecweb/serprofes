import React, { useState, useEffect } from "react";
import MovieList from "./components/MovieList.jsx";
import MovieForm from "./components/MovieForm.jsx";
import { getMovies, createMovie, updateMovie, deleteMovie } from "./services/movieService.js";

// ==========================================================
// App.jsx
// Componente principal de la aplicación
// ==========================================================

function App() {
  const [movies, setMovies] = useState([]);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [editingMovie, setEditingMovie] = useState(null);

  useEffect(() => {
    cargarPeliculas();
  }, []);

  const cargarPeliculas = async () => {
    try {
      const data = await getMovies();
      setMovies(data);
      setBackendStatus("online");
    } catch (error) {
      setBackendStatus("offline");
    }
  };

  const handleFormSubmit = async (movieData) => {
    try {
      if (editingMovie) {
        await updateMovie(editingMovie.id, movieData);
        setEditingMovie(null);
      } else {
        await createMovie(movieData);
      }
      await cargarPeliculas();
    } catch (error) {
      // Muestra la alerta con el mensaje enviado por el servidor (ej: Duplicados, XXX, etc.)
      alert(error.message);
    }
  };

  const handleEditClick = (movie) => {
    setEditingMovie(movie);
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
  };

  const handleDeleteClick = async (id) => {
    const confirmado = confirm("¿Seguro que quieres eliminar esta película?");
    if (!confirmado) return;

    try {
      await deleteMovie(id);
      await cargarPeliculas();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎬 Catálogo de Películas</h1>

        {backendStatus === "online" && (
          <span className="status status-online">🟢 Backend conectado</span>
        )}
        {backendStatus === "offline" && (
          <span className="status status-offline">🔴 Backend desconectado</span>
        )}
        {backendStatus === "checking" && (
          <span className="status status-checking">🟡 Comprobando conexión...</span>
        )}
      </header>

      {backendStatus === "offline" && (
        <div className="offline-banner">
          No se puede conectar con <strong>http://localhost:3000</strong>.
          <br />
          Comprueba que tu servidor Express esté encendido (<code>node server.js</code>).
        </div>
      )}

      <MovieForm
        editingMovie={editingMovie}
        onSubmit={handleFormSubmit}
        onCancelEdit={handleCancelEdit}
      />

      <MovieList
        movies={movies}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </div>
  );
}

export default App;