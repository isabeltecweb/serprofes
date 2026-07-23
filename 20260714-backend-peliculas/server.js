const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const PORT = process.env.PORT || 3000;

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

function esContenidoInapropiado(texto) {
  if (!texto) return false;

  return PALABRAS_PROHIBIDAS.some((palabra) =>
    texto.toLowerCase().includes(palabra)
  );
}

async function buscarPeliculaRealEnTMDb(titulo) {
  if (!TMDB_API_KEY) {
    return { errorConfig: true };
  }

  try {
    const busquedaUrl =
      `https://api.themoviedb.org/3/search/movie` +
      `?api_key=${TMDB_API_KEY}` +
      `&query=${encodeURIComponent(titulo)}` +
      `&include_adult=true`;

    const respuestaBusqueda = await fetch(busquedaUrl);
    const datosBusqueda = await respuestaBusqueda.json();

    if (!datosBusqueda.results || datosBusqueda.results.length === 0) {
      return { esReal: false };
    }

    const pelicula = datosBusqueda.results[0];

    const creditosUrl =
      `https://api.themoviedb.org/3/movie/${pelicula.id}/credits` +
      `?api_key=${TMDB_API_KEY}`;

    const respuestaCreditos = await fetch(creditosUrl);
    const datosCreditos = await respuestaCreditos.json();

    const director = datosCreditos.crew?.find(
      persona => persona.job === "Director"
    );

    return {
      esReal: true,
      esAdulto: pelicula.adult === true,
      tituloOficial: pelicula.title,
      directorOficial: director
        ? director.name
        : "Director desconocido",
      portada: pelicula.poster_path
        ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
        : null
    };
  } catch (error) {
    console.error(error);

    return {
      errorRed: true
    };
  }
}

let peliculas = [
  {
    id: 1,
    titulo: "Matrix",
    director: "Lana Wachowski",
    portada: null
  },
  {
    id: 2,
    titulo: "Interstellar",
    director: "Christopher Nolan",
    portada: null
  }
];

app.get("/api/peliculas", (req, res) => {
  res.json(peliculas);
});

app.post("/api/peliculas", async (req, res) => {
  const { titulo, director } = req.body;

  if (!titulo || !director) {
    return res.status(400).json({
      error: "Faltan datos obligatorios."
    });
  }

  if (
    esContenidoInapropiado(titulo) ||
    esContenidoInapropiado(director)
  ) {
    return res.status(400).json({
      error: "Contenido no permitido."
    });
  }

  const existe = peliculas.some(
    p =>
      p.titulo.toLowerCase().trim() ===
      titulo.toLowerCase().trim()
  );

  if (existe) {
    return res.status(400).json({
      error: "La película ya existe."
    });
  }

  const infoTMDb = await buscarPeliculaRealEnTMDb(titulo);

  if (infoTMDb.errorConfig) {
    return res.status(500).json({
      error: "TMDb API Key no configurada."
    });
  }

  if (infoTMDb.errorRed) {
    return res.status(500).json({
      error: "Error conectando con TMDb."
    });
  }

  if (!infoTMDb.esReal) {
    return res.status(404).json({
      error: "La película no existe."
    });
  }

  if (infoTMDb.esAdulto) {
    return res.status(400).json({
      error: "Película para adultos no permitida."
    });
  }

  if (
    director.toLowerCase().trim() !==
    infoTMDb.directorOficial.toLowerCase().trim()
  ) {
    return res.status(400).json({
      error: `El director oficial es: ${infoTMDb.directorOficial}`
    });
  }

  const nuevaPelicula = {
    id:
      peliculas.length > 0
        ? peliculas[peliculas.length - 1].id + 1
        : 1,
    titulo: infoTMDb.tituloOficial,
    director: infoTMDb.directorOficial,
    portada: infoTMDb.portada
  };

  peliculas.push(nuevaPelicula);

  res.status(201).json(nuevaPelicula);
});

app.put("/api/peliculas/:id", async (req, res) => {
  const id = Number(req.params.id);

  const pelicula = peliculas.find(
    p => p.id === id
  );

  if (!pelicula) {
    return res.status(404).json({
      error: "Película no encontrada."
    });
  }

  const { titulo, director } = req.body;

  const infoTMDb = await buscarPeliculaRealEnTMDb(titulo);

  if (!infoTMDb.esReal) {
    return res.status(404).json({
      error: "La película no existe."
    });
  }

  if (
    director.toLowerCase().trim() !==
    infoTMDb.directorOficial.toLowerCase().trim()
  ) {
    return res.status(400).json({
      error: `El director oficial es: ${infoTMDb.directorOficial}`
    });
  }

  pelicula.titulo = infoTMDb.tituloOficial;
  pelicula.director = infoTMDb.directorOficial;
  pelicula.portada = infoTMDb.portada;

  res.json(pelicula);
});

app.delete("/api/peliculas/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = peliculas.findIndex(
    p => p.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Película no encontrada."
    });
  }

  peliculas.splice(index, 1);

  res.json({
    mensaje: "Película eliminada correctamente."
  });
});

async function cargarPortadasIniciales() {
  for (const pelicula of peliculas) {
    const info = await buscarPeliculaRealEnTMDb(
      pelicula.titulo
    );

    if (info.esReal) {
      pelicula.portada = info.portada;

      if (info.directorOficial) {
        pelicula.director = info.directorOficial;
      }
    }
  }
}

cargarPortadasIniciales().then(() => {
  app.listen(PORT, () => {
    console.log(`🎬 Servidor iniciado en puerto ${PORT}`);
  });
});