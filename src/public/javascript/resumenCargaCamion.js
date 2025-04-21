// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
    // Obtiene la lista de pallets almacenados en sessionStorage y los convierte en un array
    const pallets = JSON.parse(sessionStorage.getItem("palletsCargados")) || [];
    
    // Obtiene los elementos del DOM
    const resumenList = document.getElementById("resumenList"); // Lista donde se mostrarán los pallets cargados
    const confirmarCargaBtn = document.getElementById("confirmarCarga"); // Botón para confirmar la carga
    const mensaje = document.getElementById("mensaje"); // Elemento donde se mostrará el mensaje de confirmación

    // Recuperar datos del usuario, incluyendo el ID
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    console.log("Usuario actual:", usuario);

    // Recuperar el array de tareas desde localStorage
    let tareaActual = JSON.parse(localStorage.getItem("tareaActual")) || [];
    console.log("Tareas registradas:", tareaActual);

    // Obtener la última tarea registrada
    let ultimaTarea = tareaActual[tareaActual.length - 1];

    if (!ultimaTarea || !ultimaTarea.codigoTarea) {
        console.error("No hay tarea registrada.");
        return;
    }

    console.log("Última tarea registrada:", ultimaTarea);
    console.log("Pallets cargados:", pallets);

    // Itera sobre la lista de pallets y los agrega a la lista en la interfaz
    pallets.forEach(pallet => {
        resumenList.innerHTML += `<li>${pallet}</li>`;
    });

    function calcularDuracion(operacionInicioStr, operacionFinStr) {
        // Convertir las fechas string a objetos Date
        const inicio = new Date(operacionInicioStr);
        const fin = new Date(operacionFinStr);
    
        // Calcular diferencia en milisegundos
        const diferenciaMs = fin - inicio;
    
        // Convertir a segundos
        const diferenciaSegundos = Math.floor(diferenciaMs / 1000);
    
        // También podrías convertir a minutos y segundos si deseas
        const minutos = Math.floor(diferenciaSegundos / 60);
        const segundos = diferenciaSegundos % 60;
    
        return {
            totalSegundos: diferenciaSegundos,
            formatoLegible: `${minutos}m ${segundos}s`
        };
    }

    // Función para obtener la hora de Chile en formato ISO
    function obtenerFechaHoraChile() {
        const fechaUTC = new Date();
        const opciones = { timeZone: "America/Santiago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
        const formatoChile = new Intl.DateTimeFormat("es-CL", opciones).formatToParts(fechaUTC);
        
        let fechaChileISO = `${formatoChile[4].value}-${formatoChile[2].value}-${formatoChile[0].value}T${formatoChile[6].value}:${formatoChile[8].value}:${formatoChile[10].value}Z`;
        return fechaChileISO;
    }

    // Evento para confirmar la carga
    confirmarCargaBtn.addEventListener("click", async function () {
        try {
            // Deshabilita el botón para evitar múltiples clics
            confirmarCargaBtn.disabled = true;

            // Obtener fecha y hora de Chile como operacionFin
            const operacionFin = obtenerFechaHoraChile();

            // Calcular duración
            const duracion = calcularDuracion(ultimaTarea.operacionInicio, operacionFin);
            console.log("Duración de la operación:", duracion.formatoLegible);

            // Muestra un mensaje de carga en la interfaz
            mensaje.textContent = "⏳ Guardando carga...";

            // Enviar datos al servidor para guardar en la base de datos
            const response = await fetch("/tareas/guardarCargaCamion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    codigoTarea: ultimaTarea.codigoTarea,
                    cargas: pallets,
                    operacionInicio: ultimaTarea.operacionInicio,
                    operacionFin: operacionFin,
                    duracionSegundos: duracion.formatoLegible,
                    codigoEscaneado: ultimaTarea.codigoEscaneado,
                    transporte: ultimaTarea.transporte,
                    turno: ultimaTarea.turno,
                    idUsuario: usuario.id
                })
            });

            console.log({
                codigoTarea: ultimaTarea.codigoTarea,
                cargas: pallets,
                operacionInicio: ultimaTarea.operacionInicio,
                operacionFin: operacionFin,
                codigoEscaneado: ultimaTarea.codigoEscaneado,
                turno: ultimaTarea.turno,
                idUsuario: usuario.id
            });

            const result = await response.json();
            console.log(result.message);

            if (response.ok) {
                // Muestra un mensaje de confirmación en la interfaz
                mensaje.textContent = `✅ Carga completada con ${pallets.length} pallets.`;

                console.log("Redirección en 3 segundos...");

                // Redirige automáticamente a la pantalla de selección de tarea después de 3 segundos
                setTimeout(() => {
                    console.log("Redirigiendo a selecciontarea.html...");
                    window.location.href = "/tareas/seleccion";
                }, 3000);
            } else {
                mensaje.textContent = "❌ Error al guardar la carga.";
                confirmarCargaBtn.disabled = false;
            }
        } catch (error) {
            console.error("Error al enviar la carga:", error);
            mensaje.textContent = "❌ Error al conectar con el servidor.";
            confirmarCargaBtn.disabled = false;
        }
    });
});
