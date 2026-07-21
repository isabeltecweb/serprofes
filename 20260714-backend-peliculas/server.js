//==================================
// 1. IMPORTACIONES
//==================================
const express = require("express");
const cors = require("cors");

//=============================================
// 2. INICIALIZACIÓN
//=============================================
const app = express();

//=============================================
// 3. MIDDLEWARES Y CONFIGURACIÓN
//=============================================
app.use(cors());
app.use(express.json());

// Importación dinámica para node-fetch
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// ⚠️ REGÍSTRATE EN https://www.themoviedb.org/ Y PEGA TU API KEY AQUÍ:
const TMDB_API_KEY = "TU_API_KEY"; 

// Lista de palabras no permitidas
const PALABRAS_PROHIBIDAS = ["xxx", "porno", "porn", "adult", "sex", "erotica", "hentai", "x-rated"];

function esContenidoInapropiado(texto) {
  if (!texto) return false;
  const textoMinusc = texto.toLowerCase();
  return PALABRAS_PROHIBIDAS.some(palabra => textoMinusc.includes(palabra));
}

// Función auxiliar para buscar en TMDb
async function buscarPeliculaRealEnTMDb(titulo) {
  if (!TMDB_API_KEY || TMDB_API_KEY === "TU_API_KEY") {
    return { errorConfig: true };
  }

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(titulo)}&include_adult=true`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    // Si la API no devuelve ningún resultado, la película NO EXISTE
    if (!datos.results || datos.results.length === 0) {
      return { esReal: false };
    }

    const peliculaEncontrada = datos.results[0];

    return {
      esReal: true,
      esAdulto: peliculaEncontrada.adult === true,
      tituloOficial: peliculaEncontrada.title,
      portada: peliculaEncontrada.poster_path 
        ? `https://image.tmdb.org/t/p/w500${peliculaEncontrada.poster_path}` 
        : null
    };
  } catch (error) {
    console.error("Error al consultar la API externa:", error);
    return { errorRed: true };
  }
}

//===============================================
// 4. BASE DE DATOS LOCAL
//===============================================
let peliculas = [
  { id: 1, titulo: "Matrix", director: "Lana Wachowski" },
  { id: 2, titulo: "Interstellar", director: "Christopher Nolan" }
];

//================================================
// 5. RUTAS DE LA API (CRUD)
//================================================

// GET: Leer películas
app.get("/api/peliculas", (req, res) => {
  res.json(peliculas);
});

// POST: Crear nueva película con validaciones
app.post("/api/peliculas", async (req, res) => {
  const { titulo, director } = req.body;

  // 1. Datos obligatorios
  if (!titulo || !director) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  // 2. Filtro de términos inapropiados o adultos
  if (esContenidoInapropiado(titulo) || esContenidoInapropiado(director)) {
    return res.status(400).json({ 
      error: "No se permiten películas con nombres o contenidos no aptos." 
    });
  }

  // 3. Comprobar que no exista ya en el catálogo
  const yaExiste = peliculas.some(
    p => p.titulo.toLowerCase().trim() === titulo.toLowerCase().trim()
  );
  if (yaExiste) {
    return res.status(400).json({ error: "Esta película ya existe en el catálogo." });
  }

  // 4. Validar existencia real mediante la API oficial
  const infoTMDb = await buscarPeliculaRealEnTMDb(titulo);

  if (infoTMDb.errorConfig) {
    return res.status(500).json({ 
      error: "El servidor requiere una API Key válida de TMDb en server.js para validar la existencia de la película." 
    });
  }

  if (infoTMDb.errorRed) {
    return res.status(500).json({ 
      error: "Error de conexión al intentar verificar la película." 
    });
  }

  if (!infoTMDb.esReal) {
    return res.status(404).json({ 
      error: "La película no existe en la base de datos oficial del cine." 
    });
  }

  if (infoTMDb.esAdulto) {
    return res.status(400).json({ 
      error: "No se permiten películas clasificadas para adultos." 
    });
  }

  // Guardar datos con el título exacto verificado
  const nuevaPelicula = {
    id: peliculas.length > 0 ? peliculas[peliculas.length - 1].id + 1 : 1,
    titulo: infoTMDb.tituloOficial,
    director,
    portada: infoTMDb.portada
  };

  peliculas.push(nuevaPelicula);
  res.status(201).json(nuevaPelicula);
});

// PUT: Actualizar película existente
app.put("/api/peliculas/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, director } = req.body;

  if (!titulo || !director) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  const pelicula = peliculas.find(p => p.id === id);
  if (!pelicula) {
    return res.status(404).json({ error: "Película no encontrada." });
  }

  if (esContenidoInapropiado(titulo) || esContenidoInapropiado(director)) {
    return res.status(400).json({ error: "Contenido no permitido." });
  }

  const duplicado = peliculas.some(
    p => p.id !== id && p.titulo.toLowerCase().trim() === titulo.toLowerCase().trim()
  );
  if (duplicado) {
    return res.status(400).json({ error: "Ya existe otra película con este título." });
  }

  let nuevaPortada = pelicula.portada;
  let nuevoTitulo = titulo;

  if (pelicula.titulo.toLowerCase().trim() !== titulo.toLowerCase().trim()) {
    const infoTMDb = await buscarPeliculaRealEnTMDb(titulo);

    if (infoTMDb.errorConfig) {
      return res.status(500).json({ error: "Falta configurar la API Key de TMDb." });
    }
    if (!infoTMDb.esReal) {
      return res.status(404).json({ error: "La película no existe en la base de datos oficial." });
    }
    if (infoTMDb.esAdulto) {
      return res.status(400).json({ error: "No se permiten películas de adultos." });
    }

    nuevaPortada = infoTMDb.portada;
    nuevoTitulo = infoTMDb.tituloOficial;
  }

  pelicula.titulo = nuevoTitulo;
  pelicula.director = director;
  pelicula.portada = nuevaPortada;

  res.json(pelicula);
});

// DELETE: Eliminar película
app.delete("/api/peliculas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = peliculas.findIndex(p => p.id === id);

  if (index !== -1) {
    peliculas.splice(index, 1);
    res.json({ mensaje: "Película eliminada correctamente." });
  } else {
    res.status(404).json({ error: "Película no encontrada." });
  }
});

//================================================
// 6. INICIALIZACIÓN DE PORTADAS Y SERVIDOR
//================================================
async function cargarPortadasIniciales() {
  for (let pelicula of peliculas) {
    const info = await buscarPeliculaRealEnTMDb(pelicula.titulo);
    if (info.esReal) {
      pelicula.portada = info.portada;
    }
  }
  console.log("🎨 Verificación y portadas iniciales procesadas.");
}

cargarPortadasIniciales().then(() => {
  app.listen(3000, () => {
    console.log("🎬 Servidor escuchando en el puerto 3000 con validación estricta activa.");
  });
});