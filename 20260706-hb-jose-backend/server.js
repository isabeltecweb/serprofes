//1. IMPORTAR HERRAMIENTAS
const express = require('express');
const app = express();

//2. NUESTRA BASE DE DATOS FALSA (El Catálgo)
// Esto es un Array de objetos (JSON)
const productos = [
    {id: 1, articulo: "Portatil HP", stock:15},
    {id: 2, articulo: "Monitor Dell", stock:5},
    {id: 3, articulo:"Teclado Mecánico", stock:22},
    {id: 4, articulo: "Limpieza de pantalla", stock:15},
    {id: 5, articulo: "Tecla suelta", stock:5},
    {id: 6, articulo:"Ventilador", stock:22}
];

//3. LA RUTA (Camarero)
//Cuando alguien pida 'api/productos', le entregamos el inventario

app.get('/api/productos', (req, res) => {
    //res.json convierte los datos para que el internet entienda
    res.json(inventario);
});
app.get('/api/productos', (req, res) => {
    //res.json convierte los datos para que el internet entienda
    res.json(productos);
});

//4.ENCENDER EL SERVIDOR
//Le decimos que escuche en el puerto 3000
app.listen(3000, () => {
    console.log('🎉 Servidor encendido y escuchando en el puerto 3000');
});