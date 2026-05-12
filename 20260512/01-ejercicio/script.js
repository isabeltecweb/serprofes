//1. EL OBJETO
//Usamos llaves {} para crear la ficha tecnica
// y dos puntos para dar valor
let producto = {
    nombre: "🍎 Manzanas",
    precio: 2.5,
    categoria: "Fruta",
};

//2. ¿Cómo leemos un dato concreto y lo mandmos
// al html?
document.getElementById("prod-nombre").textContent=producto.nombre; 
document.getElementById("prod-precio").textContent=producto.precio; 
document.getElementById("prod-cat").textContent=producto.categoria; 

//3. mini Reto
function mostrarMiFicha(){
    //1. Crea tu propio objeto "alumno"
    //2. Mostrar los datos en html"
 //1. Crear el objeto "alumno"
    let alumno = {
        nombre: "👩‍🦰 Ana Maria",
        edad: "20",
        ciudad: "Madrid",
    };

    //2. Mostrar los datos en HTML
    document.getElementById("alum-nombre").textContent = alumno.nombre;
    document.getElementById("alum-edad").textContent = alumno.edad;
    document.getElementById("alum-ciudad").textContent = alumno.ciudad;
}



