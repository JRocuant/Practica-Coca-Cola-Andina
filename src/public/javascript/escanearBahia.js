document.addEventListener("DOMContentLoaded", function () {
    const submitCodeBtn = document.getElementById("submitCodeBtn");
    const codeInput = document.getElementById("codeInput");
    const mensaje = document.getElementById("mensaje");

    // Recuperar el array de tareas desde localStorage
    let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];
    console.log("Tareas registradas:", tareaActual);

    // Si quieres obtener solo los códigos de tarea
    let codigos = tareaActual.map(tarea => tarea.codigoTarea);
    console.log("Códigos de tarea:", codigos);

    // Obtiene la última tarea registrada (suponiendo que es la tarea en curso)
    let ultimaTarea = tareaActual[tareaActual.length - 1];
    console.log("Última tarea registrada:", ultimaTarea);

    // Recuperar datos del usuario, incluyendo el ID
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    console.log("Usuario actual:", usuario);

    // Función para obtener la hora de Chile en formato ISO
    function obtenerFechaHoraChile() {
        const fechaUTC = new Date();
        const opciones = { timeZone: "America/Santiago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
        const formatoChile = new Intl.DateTimeFormat("es-CL", opciones).formatToParts(fechaUTC);
        
        let fechaChileISO = `${formatoChile[4].value}-${formatoChile[2].value}-${formatoChile[0].value}T${formatoChile[6].value}:${formatoChile[8].value}:${formatoChile[10].value}Z`;
        return fechaChileISO;
    }

    // Botón para confirmar código
    submitCodeBtn.addEventListener("click", function () {
        const bahiaValue = codeInput.value.trim();

        if (bahiaValue !== "") {
            // Agrega el código ingresado a la última tarea registrada
            if (tareaActual.length > 0) {
                tareaActual[tareaActual.length - 1].codigoBahia = bahiaValue;
            }

            // Guarda el array actualizado en localStorage
            localStorage.setItem('tareaActual', JSON.stringify(tareaActual));

            // Redirige a la página correspondiente
            const nextPage = '/tareas/seleccion';

            // Obtener fecha y hora de Chile como operacionFin
            const operacionFin = obtenerFechaHoraChile();

            // Realiza la llamada al servidor para guardar el pallet listo
            fetch("/tareas/guardarPalletListo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    codigoTarea: ultimaTarea.codigoTarea,
                    codigoBahia: bahiaValue,
                    operacionInicio: ultimaTarea.operacionInicio,
                    operacionFin: operacionFin,
                    duracionSegundos: calcularDuracion(ultimaTarea.operacionInicio, operacionFin).formatoLegible,
                    codigoEscaneado: ultimaTarea.codigoEscaneado,
                    transporte: ultimaTarea.transporte,
                    turno: ultimaTarea.turno,
                    idUsuario: usuario.id
                })
            })
            .then(response => response.json())
            .then(result => {
                console.log(result.message);
                if (result.message === "Carga guardada correctamente") {
                    window.location.href = nextPage;
                } else {
                    mensaje.textContent = "❌ Error al guardar la carga.";
                }
            })
            .catch(error => {
                console.error("Error al enviar la carga:", error);
                mensaje.textContent = "❌ Error al conectar con el servidor.";
            });
        } else {
            alert("Por favor, ingrese un código válido.");
        }
    });

    function calcularDuracion(operacionInicioStr, operacionFinStr) {
        const inicio = new Date(operacionInicioStr);
        const fin = new Date(operacionFinStr);
        const diferenciaMs = fin - inicio;
        const diferenciaSegundos = Math.floor(diferenciaMs / 1000);

        const minutos = Math.floor(diferenciaSegundos / 60);
        const segundos = diferenciaSegundos % 60;
        
        return { totalSegundos: diferenciaSegundos,      
                formatoLegible: `${minutos}m ${segundos}s`
         };
    }
});
