function comprobarNumero() {
    // 1. Atrapamos elnúmero usando let
    let numero = Number(document.getElementById('numero-input').value);
    let etiqueta = document.getElementById('mensaje-salida');

    //2. Tomamos la decisión con IF / ELSE
    if (numero % 2 === 0) {
        //Si el resto de la division entre 2 es 0 ...
        etiqueta.textContent = "El número " + numero + " es PAR";
        etiqueta.style.color = "green";
    } else {
        //Si no ...
        etiqueta.textContent = "El número " + numero + " es IMPAR";
        etiqueta.style.color = "red";
    }
}