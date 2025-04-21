document.addEventListener("DOMContentLoaded", function () {
    const palletInput = document.getElementById("palletInput");
    const bahiaInput = document.getElementById("bahiaInput");
    const continuarBtn = document.getElementById("continuarBtn");

    // Recuperar el array de tareas desde localStorage
    let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];
    console.log("Tareas registradas:", tareaActual);

    let palletEscaneado = tareaActual[tareaActual.length - 1].codigoEscaneado; // Para guardar el pallet escaneado

    // Evento: al presionar el botón de continuar
    continuarBtn.addEventListener("click", function () {
        const bahiaEscaneada = bahiaInput.value.trim();

        console.log("Pallet escaneado:", palletEscaneado);
        console.log("Bahía escaneada:", bahiaEscaneada);

        if (tareaActual.length > 0) {
            // Agregamos los datos a la última tarea
            tareaActual[tareaActual.length - 1].palletCambiado = palletEscaneado;
            tareaActual[tareaActual.length - 1].bahiaInicial = bahiaEscaneada;
        }

        // Guardamos la actualización en localStorage
        localStorage.setItem('tareaActual', JSON.stringify(tareaActual));
        console.log("Tarea actualizada:", tareaActual);

        // Redirigir a la siguiente pantalla
        window.location.href = "/tareas/escanearPalletCambio";
    });
});
