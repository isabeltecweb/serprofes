const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const PORT = process.env.PORT || 3000;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const PALABRAS_PROHIBIDAS = [
  "xxx",
  "porno",
  "porn",
  "adult",
  "sex",
  "erotica",
  "hentai",
  "x-rated"
];

function contenidoInapropiado(texto = "") {
  return PALABRAS_PROHIBIDAS.some((palabra) =>
    texto.toLowerCase().includes(palabra)
  );
}

async function obtenerPeliculaTMDb(titulo) {
  try {
    const searchUrl =
      `https://api.themoviedb.org/3/search/movie` +
      `?api_key=${TMDB_API_KEY}` +
      `&query=${encodeURIComponent(titulo)}` +
      `&include_adult=true`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.results?.length) {
      return null;
    }

    const movie = searchData.results[0];

    const creditsUrl =
      `https://api.themoviedb.org/3/movie/${movie.id}/credits` +
      `?api_key=${TMDB_API_KEY}`;

    const creditsResponse = await fetch(creditsUrl);
    const creditsData = await creditsResponse.json();

    const director =
      creditsData.crew?.find(
        (person) => person.job === "Director"
      )?.name || "Director desconocido";

    return {
      titulo: movie.title,
      director,
      portada: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      adult: movie.adult
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

let peliculas = [];

app.get("/api/peliculas", (req, res) => {
  res.json(peliculas);
});

app.post("/api/peliculas", async (req, res) => {
  const { titulo } = req.body;

  if (!titulo) {
    return res.status(400).json({
      error: "Debes indicar un título."
    });
  }

  if (contenidoInapropiado(titulo)) {
    return res.status(400).json({
      error: "Contenido no permitido."
    });
  }

  const duplicada = peliculas.some(
    (p) =>
      p.titulo.toLowerCase() ===
      titulo.toLowerCase()
  );

  if (duplicada) {
    return res.status(400).json({
      error: "La película ya existe."
    });
  }

  const peliculaTMDb =
    await obtenerPeliculaTMDb(titulo);

  if (!peliculaTMDb) {
    return res.status(404).json({
      error: "La película no existe."
    });
  }

  if (peliculaTMDb.adult) {
    return res.status(400).json({
      error:
        "Las películas para adultos no están permitidas."
    });
  }

  const nuevaPelicula = {
    id: Date.now(),
    titulo: peliculaTMDb.titulo,
    director: peliculaTMDb.director,
    portada: peliculaTMDb.portada
  };

  peliculas.push(nuevaPelicula);

  res.status(201).json(nuevaPelicula);
});

app.put("/api/peliculas/:id", async (req, res) => {
  const id = Number(req.params.id);

  const pelicula = peliculas.find(
    (p) => p.id === id
  );

  if (!pelicula) {
    return res.status(404).json({
      error: "Película no encontrada."
    });
  }

  const { titulo } = req.body;

  const peliculaTMDb =
    await obtenerPeliculaTMDb(titulo);

  if (!peliculaTMDb) {
    return res.status(404).json({
      error: "La película no existe."
    });
  }

  pelicula.titulo = peliculaTMDb.titulo;
  pelicula.director = peliculaTMDb.director;
  pelicula.portada = peliculaTMDb.portada;

  res.json(pelicula);
});

app.delete("/api/peliculas/:id", (req, res) => {
  const id = Number(req.params.id);

  peliculas = peliculas.filter(
    (p) => p.id !== id
  );

  res.json({
    mensaje: "Película eliminada."
  });
});

app.listen(PORT, () => {
  console.log(
    `🎬 CineVentura iniciado en puerto ${PORT}`
  );
});