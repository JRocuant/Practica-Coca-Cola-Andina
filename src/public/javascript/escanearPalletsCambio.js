// Referencias a elementos del DOM
const confirmarBtn = document.getElementById('confirmarBtn');
const bahiaDestinoInput = document.getElementById('bahiaDestinoCode');
const mensaje = document.getElementById('mensaje');
const mensaje2 = document.getElementById('mensaje2'); //NUEVO
const agregarPalletBtn = document.getElementById('agregarPallet');
const palletInput = document.getElementById('palletCode');
const palletList = document.getElementById('palletList');

// Recuperar datos del usuario, incluyendo el ID
const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
console.log("Usuario actual:", usuario);

// Variables para almacenar los pallets y la tarea actual
let pallets = [];
let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];
let palletEscaneado = localStorage.getItem("palletEscaneado") || ""; // Recuperar el pallet del primer formulario

// Función para calcular duración
function calcularDuracion(operacionInicioStr, operacionFinStr) {
    const inicio = new Date(operacionInicioStr);
    const fin = new Date(operacionFinStr);
    const diferenciaMs = fin - inicio;
    const diferenciaSegundos = Math.floor(diferenciaMs / 1000);
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

// Evento para agregar pallet escaneado
agregarPalletBtn.addEventListener("click", () => {
    //const palletCode = palletInput.value.trim();

    // Eliminar todos los espacios del input
    const palletValueRaw = palletInput.value.trim();
    const palletCode = palletValueRaw.replace(/\s+/g, ''); // <--- Elimina todos los espacios

    if (palletCode !== "") {
        const ultimaTarea = tareaActual[tareaActual.length - 1];

        // Verificar si coincide con el pallet de la tarea
        if (ultimaTarea.palletCambiado !== palletCode) {
            mensaje.textContent = `❌ El pallet escaneado (${palletCode}) no coincide con el pallet de la tarea (${ultimaTarea.palletCambiado}).`;
            console.warn(`El pallet escaneado no coincide. Esperado: ${ultimaTarea.palletCambiado}, Escaneado: ${palletCode}`);
            palletInput.value = "";
            return;
        }

        // Verificar si ya fue ingresado
        if (pallets.includes(palletCode)) {
            alert(`El pallet ${palletCode} ya fue ingresado correctamente.`);
            palletInput.value = "";
            return;
        }

        // Si no está, agregarlo
        pallets.push(palletCode);

        // Mostrar en la lista visual solo una vez
        const listItem = document.createElement("li");
        listItem.textContent = palletCode;
        palletList.appendChild(listItem);

        palletInput.value = "";

        mensaje2.textContent = `✅ Pallet desde Bahía de origen ${tareaActual[tareaActual.length - 1].bahiaInicial}`;

        // Habilitar botón si ambos campos tienen datos
        if (bahiaDestinoInput.value.trim() !== "") {
            confirmarBtn.disabled = false;
        }
    } else {
        alert("Debes ingresar un código de pallet.");
    }
});

// Evento para habilitar el botón Confirmar al ingresar bahía
bahiaDestinoInput.addEventListener("input", () => {
    if (pallets.length > 0 && bahiaDestinoInput.value.trim() !== "") {
        confirmarBtn.disabled = false;
    } else {
        confirmarBtn.disabled = true;
    }
});

// Evento para confirmar el cambio
confirmarBtn.addEventListener("click", async function () {
    if (pallets.length > 0 && bahiaDestinoInput.value.trim() !== "") {
        const bahiaDestino = bahiaDestinoInput.value.trim();
        const bahiaInicial = tareaActual[tareaActual.length - 1].bahiaInicial;

        // Validar que la bahía de destino no sea la misma que la inicial
        if (bahiaDestino === bahiaInicial) {
            mensaje.textContent = `❌ La bahía de destino no puede ser la misma que la bahía de origen (${bahiaInicial}).`;
            console.warn(`La bahía de destino (${bahiaDestino}) no puede ser igual a la bahía de origen (${bahiaInicial})`);
            return; // Detener ejecución
        }

        mensaje.textContent = `⏳ Validando...`;
        confirmarBtn.disabled = true;

        console.log("Pallet confirmado:", pallets[0]);
        console.log("Bahía destino:", bahiaDestino);

        // Actualizar tareaActual
        if (tareaActual.length > 0) {
            tareaActual[tareaActual.length - 1].palletConfirmado = pallets[0];
            tareaActual[tareaActual.length - 1].bahiaDestino = bahiaDestino;
        }

        const ultimaTarea = tareaActual[tareaActual.length - 1];

        // Validar que palletConfirmado y palletCambiado sean iguales
        if (ultimaTarea.palletCambiado !== ultimaTarea.palletConfirmado) {
            mensaje.textContent = `❌ El pallet escaneado (${ultimaTarea.palletConfirmado}) no coincide con el pallet de la tarea (${ultimaTarea.palletCambiado}).`;
            console.warn(`El pallet escaneado no coincide. Esperado: ${ultimaTarea.palletCambiado}, Escaneado: ${ultimaTarea.palletConfirmado}`);
            confirmarBtn.disabled = false;
            return; // Detener ejecución
        }

        localStorage.setItem('tareaActual', JSON.stringify(tareaActual));
        console.log("Tarea actualizada:", tareaActual);

        try {
            // Obtener fecha y hora de Chile como operacionFin
            const operacionFin = obtenerFechaHoraChile();

            const duracion = calcularDuracion(ultimaTarea.operacionInicio, operacionFin);
            console.log("Duración de la operación:", duracion.formatoLegible);

            const response = await fetch("/tareas/guardarCambioBahia", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    codigoTarea: ultimaTarea.codigoTarea,
                    operacionInicio: ultimaTarea.operacionInicio,
                    operacionFin: operacionFin,
                    bahiaInicial: ultimaTarea.bahiaInicial,
                    palletConfirmado: ultimaTarea.palletConfirmado,
                    bahiaDestino: ultimaTarea.bahiaDestino,
                    codigoEscaneado: ultimaTarea.codigoEscaneado,
                    duracionSegundos: duracion.formatoLegible,
                    transporte: ultimaTarea.transporte,
                    turno: ultimaTarea.turno,
                    idUsuario: usuario.id
                })
            });

            console.log({
                codigoTarea: ultimaTarea.codigoTarea,
                operacionInicio: ultimaTarea.operacionInicio,
                operacionFin: operacionFin,
                bahiaInicial: ultimaTarea.bahiaInicial,
                palletConfirmado: ultimaTarea.palletConfirmado,
                bahiaDestino: ultimaTarea.bahiaDestino,
                codigoEscaneado: ultimaTarea.codigoEscaneado,
                duracionSegundos: duracion.formatoLegible,
                transporte: ultimaTarea.transporte,
                turno: ultimaTarea.turno,
                idUsuario: usuario.id
            });

            const result = await response.json();
            console.log(result.message);

            if (response.ok) {
                mensaje.textContent = `✅ Pallet cambiado exitosamente a Bahía ${bahiaDestino}`;
                console.log("Redirección en 3 segundos...");
                setTimeout(() => {
                    console.log("Redirigiendo a selección de tarea...");
                    window.location.href = "/tareas/seleccion";
                }, 3000);
            } else {
                mensaje.textContent = "❌ Error al guardar el cambio.";
                confirmarBtn.disabled = false;
            }
        } catch (error) {
            console.error("Error al enviar la información:", error);
            mensaje.textContent = "❌ Error al conectar con el servidor.";
            confirmarBtn.disabled = false;
        }

    } else {
        alert("Debe escanear el pallet y la bahía destino antes de confirmar.");
    }
});
