import React, { useState, useEffect } from "react";

function MovieForm({
  editingMovie,
  onSubmit,
  onCancelEdit
}) {
  const [titulo, setTitulo] = useState("");

  useEffect(() => {
    if (editingMovie) {
      setTitulo(editingMovie.titulo);
    } else {
      setTitulo("");
    }
  }, [editingMovie]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!titulo.trim()) {
      return;
    }

    onSubmit({
      titulo: titulo.trim()
    });

    if (!editingMovie) {
      setTitulo("");
    }
  };

  const isEditing = editingMovie !== null;

  return (
    <form
      className="movie-form"
      onSubmit={handleSubmit}
    >
      <h2 className="form-title">
        {isEditing
          ? "✏️ Editar película"
          : "🎬 Añadir película"}
      </h2>

      <div className="form-group">
        <label htmlFor="titulo">
          Título de la película
        </label>

        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) =>
            setTitulo(e.target.value)
          }
          placeholder="Ejemplo: Interstellar"
          required
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
        >
          {isEditing
            ? "Actualizar"
            : "Agregar"}
        </button>

        {isEditing && (
          <button
            type="button"
            className="btn btn-cancel"
            onClick={onCancelEdit}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default MovieForm;