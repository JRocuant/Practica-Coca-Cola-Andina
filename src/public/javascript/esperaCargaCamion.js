// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {

    // Recuperar los palletMaximo almacenados en localStorage
    let palletMaximo = JSON.parse(localStorage.getItem("palletMaximo")) || {};

    // Recuperar la tarea actual
    let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];

    // Variable para almacenar el valor del pallet máximo
    let maxPalletValue = null;  // Inicializamos la variable como null

    // Verificar si hay una tarea registrada
    if (tareaActual.length > 0) {
        let ultimaTarea = tareaActual[tareaActual.length - 1]; 
        let transporteID = ultimaTarea.transporte; // Obtiene el ID del transporte

        console.log("Última tarea:", ultimaTarea);
        console.log("Buscando palletMaximo para el transporte ID:", transporteID);

        // Verificar si existe el transporteID en palletMaximo
        if (palletMaximo.hasOwnProperty(transporteID)) {
            maxPalletValue = palletMaximo[transporteID];  // Asignamos el valor del pallet máximo
            console.log("Pallet máximo encontrado para este transporte:", maxPalletValue);
        } else {
            console.log("No se encontró pallet máximo para este transporte.");
        }
    } else {
        console.log("No hay tareas registradas.");
    }

    // Ahora maxPalletValue contiene el valor del pallet máximo (si se encontró)
    console.log("Valor del pallet máximo:", maxPalletValue);

    // Actualizamos el contenido del <span> con el valor de maxPalletValue
    if (maxPalletValue !== null) {
        document.getElementById('maxPalletValueDisplay').textContent = maxPalletValue;
    } else {
        document.getElementById('maxPalletValueDisplay').textContent = 'No definido'; // Si no hay valor
    }

    let pallets = []; // Array para almacenar los códigos de los pallets escaneados
    const maxPallets = maxPalletValue; // Número máximo de pallets requeridos

    // Recuperar el array de tareas desde localStorage
    console.log("Tareas registradas:", tareaActual);

    // Si quieres obtener solo los códigos de tarea
    let codigos = tareaActual.map(tarea => tarea.codigoTarea);
    console.log("Códigos de tarea:", codigos);

    // Obtiene la última tarea registrada (suponiendo que es la tarea en curso)
    let ultimaTarea = tareaActual[tareaActual.length - 1];

    console.log("Última tarea registrada:", ultimaTarea);

    // Obtiene los elementos del DOM
    const palletInput = document.getElementById("palletCode"); // Campo de entrada para escanear pallet
    const palletList = document.getElementById("palletList"); // Lista donde se mostrarán los pallets agregados
    const terminarTareaBtn = document.getElementById("terminarTarea"); // Botón para finalizar la tarea
    const contadorPallets = document.getElementById("contadorPallets"); // Elemento para mostrar el contador

    // Función para agregar pallet a la lista
    function agregarPallet() {
        const pallet = palletInput.value.trim(); // Obtiene el valor ingresado y elimina espacios en blanco

        if (pallet) {
            // Verificar si el pallet ya ha sido escaneado
            if (pallets.includes(pallet)) {
                alert("Este pallet ya ha sido escaneado."); // Muestra un mensaje de alerta si el pallet ya existe
                palletInput.value = ""; // Limpia el campo de entrada
                return; // Sale de la función si el pallet ya ha sido escaneado
            }

            if (pallets.length < maxPallets) {
                pallets.push(pallet); // Agrega el pallet al array
                palletList.innerHTML += `<li>${pallet}</li>`; // Agrega el pallet a la lista en el DOM
                palletInput.value = ""; // Limpia el campo de entrada después de agregar el pallet

                // Actualiza el contador en pantalla
                contadorPallets.textContent = `Pallets: ${pallets.length}/${maxPallets}`;

                // Actualiza la tarea actual con la lista de pallets cargados
                if (ultimaTarea) {
                    ultimaTarea.palletsCargados = pallets; // Agrega los pallets al objeto de la tarea
                    tareaActual[tareaActual.length - 1] = ultimaTarea; // Guarda la tarea actualizada en el array
                    localStorage.setItem("tareaActual", JSON.stringify(tareaActual)); // Guarda el array actualizado en localStorage
                }
            }

            if (pallets.length >= maxPallets) {
                terminarTareaBtn.disabled = false; // Habilita el botón solo cuando se llega a 10 pallets
            }
        } else {
            alert("Debe escanear un pallet."); // Muestra una alerta si no hay código ingresado
        }
    }

    // Evento para finalizar la tarea y redirigir a la pantalla de resumen
    terminarTareaBtn.addEventListener("click", function () {
        if (pallets.length >= maxPallets) {
            sessionStorage.setItem("palletsCargados", JSON.stringify(pallets)); // Guarda los pallets en sessionStorage
            window.location.href = "/tareas/resumenCargaCamion"; // Redirige a la página de resumen de carga
        }
    });

    // Expone la función `agregarPallet` al objeto global `window`
    window.agregarPallet = agregarPallet;
});
