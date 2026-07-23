import React, { useEffect, useState } from "react";

import MovieForm from "./components/MovieForm";
import MovieList from "./components/MovieList";

import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie
} from "./services/movieService";

function App() {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);

  const [backendStatus, setBackendStatus] =
    useState("checking");

  const [message, setMessage] =
    useState(null);

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    try {
      const data = await getMovies();

      setMovies(data);
      setBackendStatus("online");
    } catch {
      setBackendStatus("offline");
    }
  }

  function showMessage(text, type) {
    setMessage({
      text,
      type
    });

    setTimeout(() => {
      setMessage(null);
    }, 4000);
  }

  async function handleSubmit(movieData) {
    try {
      if (editingMovie) {
        await updateMovie(
          editingMovie.id,
          movieData
        );

        showMessage(
          "🎬 Película actualizada correctamente",
          "success"
        );

        setEditingMovie(null);
      } else {
        await createMovie(movieData);

        showMessage(
          "🍿 Película agregada correctamente",
          "success"
        );
      }

      loadMovies();
    } catch (error) {
      showMessage(
        error.message,
        "error"
      );
    }
  }

  async function handleDelete(id) {
    if (
      !window.confirm(
        "¿Eliminar película?"
      )
    ) {
      return;
    }

    try {
      await deleteMovie(id);

      showMessage(
        "🗑️ Película eliminada",
        "success"
      );

      loadMovies();
    } catch (error) {
      showMessage(
        error.message,
        "error"
      );
    }
  }

  return (
    <div className="app-container">

      <div className="logo-container">

        <h1 className="logo">
          🎬 CineVentura
        </h1>

        <p className="logo-subtitle">
          Descubre el cine auténtico
        </p>

      </div>

      <header className="app-header">

        {backendStatus === "online" && (
          <span className="status status-online">
            🟢 Conectado
          </span>
        )}

        {backendStatus === "offline" && (
          <span className="status status-offline">
            🔴 Desconectado
          </span>
        )}

        {backendStatus === "checking" && (
          <span className="status status-checking">
            🟡 Comprobando...
          </span>
        )}

      </header>

      {message && (
        <div
          className={`alert alert-${message.type}`}
        >
          {message.text}
        </div>
      )}

      <MovieForm
        editingMovie={editingMovie}
        onSubmit={handleSubmit}
        onCancelEdit={() =>
          setEditingMovie(null)
        }
      />

      <MovieList
        movies={movies}
        onEdit={setEditingMovie}
        onDelete={handleDelete}
      />

    </div>
  );
}

export default App;