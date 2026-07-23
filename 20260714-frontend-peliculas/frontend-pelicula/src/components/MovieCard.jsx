import React from "react";

function MovieCard({
  movie,
  onEdit,
  onDelete
}) {
  return (
    <div className="movie-card">

      <img
        src={
          movie.portada ||
          "https://via.placeholder.com/500x750?text=Sin+Portada"
        }
        alt={movie.titulo}
        className="movie-poster"
      />

      <div className="movie-card-info">

        <h3 className="movie-title">
          {movie.titulo}
        </h3>

        <p className="movie-director">
          🎬 {movie.director}
        </p>

      </div>

      <div className="movie-card-actions">

        <button
          className="btn btn-edit"
          onClick={() => onEdit(movie)}
        >
          Editar
        </button>

        <button
          className="btn btn-delete"
          onClick={() =>
            onDelete(movie.id)
          }
        >
          Eliminar
        </button>

      </div>

    </div>
  );
}

export default MovieCard;