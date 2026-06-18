// 1. Importación del framework Express
const express = require("express");
// 2. Inicialización de la instancia de la aplicación servidor
const app = express();
// 🚨 3. CONFIGURACIÓN DEL MIDDLEWARE ESENCIAL
// Actúa como traductor nativo. Configura al servidor para interceptar las peticiones
// entrantes y deserializar de forma automática el formato JSON a objetos legibles.
app.use(express.json());
// 4. ESTRUCTURA DE DATOS EN MEMORIA (Simulación de Base de Datos)
let estudiantes = [
{ id: 1, nombre: "Aroa", curso: "React" },
{ id: 2, nombre: "Carlos", curso: "Node" }
];
// ==========================================
// 📥 RUTA GET: LECTURA DE DATOS CENTRALIZADA
// ==========================================
// Al realizar una petición HTTP GET al endpoint especificado, el servidor escupe el array
//completo.
app.get("/api/estudiantes", (req, res) => {
res.json(estudiantes);
});
// ==========================================
// 📤 RUTA POST: INSERCIÓN DE NUEVA INFORMACIÓN
// ==========================================
// Al realizar una petición HTTP POST, el servidor captura los datos del cuerpo y los añade
//en memoria.
app.post("/api/estudiantes", (req, res) => {
// A. Extracción de los datos enviados desde el cliente (viven dentro de req.body)
const nuevoEstudiante = req.body;
// B. Inyección de la estructura de datos al array existente por medio de .push()
estudiantes.push(nuevoEstudiante);
// C. Respuesta de confirmación devolviendo el estado y la lista actualizada en tiempo real
res.json({
mensaje: "¡Estudiante añadido con éxito a la base de datos!",
listaActualizada: estudiantes
});
});
// 5. APERTURA Y ESCUCHA DEL PUERTO RED
// Configuramos el servidor para mantenerse escuchando peticiones activas en el puerto
3000.
app.listen(3000, () => {
console.log("😊 ¡Servidor funcionando! URL: http://localhost:3000");
});
