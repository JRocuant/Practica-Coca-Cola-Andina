document.addEventListener("DOMContentLoaded", function () {

    // Recuperar el array de tareas desde localStorage
    let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];
    console.log("Tareas registradas:", tareaActual);

    // Obtiene la tarea seleccionada desde sessionStorage
    const selectedTask = sessionStorage.getItem("selectedTask");
    console.log("Tarea seleccionada desde sessionStorage:", selectedTask);

    // Muestra la tarea seleccionada
    const selectedTaskElement = document.getElementById("selectedTask");
    if (selectedTask) {
        selectedTaskElement.textContent = `Tarea seleccionada: ${selectedTask}`;
    } else {
        selectedTaskElement.textContent = "No se ha seleccionado ninguna tarea.";
    }

    // Determina la página siguiente según la tarea
    let nextPage;
    if (selectedTask === "cambio-entre-bahías") {
        nextPage = "/tareas/esperaCambioBahia";
    } else if (selectedTask === "cargar-camion") {
        nextPage = "/tareas/esperaCargaCamion";
    } else {
        nextPage = "/tareas/esperaPallet";
    }

    // Botón para confirmar código
    const submitCodeBtn = document.getElementById("submitCodeBtn");
    const codeInput = document.getElementById("codeInput");

    function obtenerTransporteYPalet(codigo) {
        // Expresión regular para obtener los datos del código
        const regex = /^000(\d{7})\d{14}(\d{2})$/;
        
        console.log("Código a evaluar:", codigo); // Depuración: Verifica el código que se evalúa
        const resultado = regex.exec(codigo);
        
        if (resultado) {
            const transporte = resultado[1]; // Código de transporte (7 dígitos)
            const pallet = resultado[2]; // Número del pallet (2 dígitos)

            console.log("Código de transporte:", transporte);  // Depuración: Muestra el código de transporte
            console.log("Número de pallet:", pallet);  // Depuración: Muestra el número de pallet

            return { transporte, pallet };
        } else {
            console.log("Código inválido"); // Si no pasa la validación, lo muestra
            return null;
        }
    }

    submitCodeBtn.addEventListener("click", function () {
        // Eliminar todos los espacios del input
        const codeValueRaw = codeInput.value.trim();
        const codeValue = codeValueRaw.replace(/\s+/g, ''); // <--- Elimina todos los espacios

        const datos = obtenerTransporteYPalet(codeValue);
    
        if (codeValue !== "" && datos) {
            // Aquí se elimina la validación con la base de datos y se sigue adelante sin verificar en la base de datos
            if (tareaActual.length > 0) {
                tareaActual[tareaActual.length - 1].codigoEscaneado = codeValue;
                tareaActual[tareaActual.length - 1].transporte = datos.transporte;
            }

            localStorage.setItem('tareaActual', JSON.stringify(tareaActual));
            console.log("Código guardado:", codeValue);
            window.location.href = nextPage;
        } else {
            alert("Por favor, ingrese un código válido.");
        }
    });
    

    // Manejo del botón "Cancelar"
    document.getElementById("cancelBtn").addEventListener("click", function () {
        console.log("Redirección cancelada, volviendo a selección de tarea.");
        window.location.href = "/tareas/seleccion";
    });
});
