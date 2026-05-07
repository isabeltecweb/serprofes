function calcularIMC() {
    /*Obtener datos*/
    let peso = Number(document.getElementById("input-peso").value);
    let altura = Number(document.getElementById("input-altura").value);
    let etiqueta = document.getElementById("mensaje-salida");
    /*Calcular IMC*/
    let imc = peso / (altura * altura);
    /*Mostrar resultado Multiples desiciones */
    if (imc < 18.5) {
        etiqueta.textContent = "Tu IMC es:" + imc.toFixed(2) + "Estas un palo de chifa";
        etiqueta.style.color = "blue";
    } 
    else if (imc >= 18.5 && imc < 24.9) {
        etiqueta.textContent ="Tu IMC es " + imc.toFixed(2) + "Tienes un Peso Saludable 👍 👌 ✅";
        etiqueta.style.color = "green";    
    } 
    else {
        etiqueta.textContent = "Tu IMC es" + imc.toFixed(2) +  "tienes Sobrepeso 🤦‍♀️🧐🐷";
        etiqueta.style.color = "red"
    }
    
}