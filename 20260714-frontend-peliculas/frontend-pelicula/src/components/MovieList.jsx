import React from "react";
import MovieCard from "./MovieCard";

function MovieList({
  movies,
  onEdit,
  onDelete
}) {
  if (movies.length === 0) {
    return (
      <div className="empty-message">
        🍿 No hay películas todavía.
      </div>
    );
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default MovieList;