// 1. Selección de elementos del DOM
const equipoInput = document.getElementById('equipo-input');
const problemaInput = document.getElementById('problema-input');
const btnTicket = document.getElementById('btn-ticket');
const listaTickets = document.getElementById('lista-tickets');
const ticketCounter = document.getElementById('ticket-counter');

// 2. Variable de estado para el contador
let totalTickets = 0;

// 3. Función principal para añadir el ticket
function agregarTicket() {
    // Obtener los valores eliminando espacios en blanco extra con trim()
    const equipoValor = equipoInput.value.trim();
    const problemaValor = problemaInput.value.trim();

    // VALIDACIÓN: Si alguno de los campos está vacío, frena la ejecución
    if (equipoValor === "" || problemaValor === "") {
        alert("Por favor, rellena todos los campos antes de abrir un ticket.");
        return; // El return vacío evita que el código de abajo se ejecute
    }

    // LÓGICA: Crear la estructura del ticket dinámicamente
    const nuevoTicket = document.createElement('li');
    nuevoTicket.classList.add('ticket-item');
    
    // Inyectamos el HTML interno con los datos de los inputs
    nuevoTicket.innerHTML = `
        <strong>🖥️ Equipo: ${equipoValor}</strong>
        <span>⚠️ Problema: ${problemaValor}</span>
    `;

    // Añadir el nuevo ticket a la lista en la pantalla
    listaTickets.appendChild(nuevoTicket);

    // EL CEREBRO: Actualizar y sumar +1 al contador
    totalTickets++;
    ticketCounter.textContent = totalTickets;

    // LIMPIEZA: Vaciar los inputs para la siguiente incidencia
    equipoInput.value = "";
    problemaInput.value = "";
}

// 4. Evento de escucha (Listener) al hacer clic en el botón
btnTicket.addEventListener('click', agregarTicket);