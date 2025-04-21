// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones de tareas con la clase 'task-btn'
    const taskButtons = document.querySelectorAll('.task-btn');
    
    function determinarTurno(fechaISO) { //Funcion para determinar hora Chile
        const fecha = new Date(fechaISO);
        fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset()); // Ajustar a UTC
        const opciones = { timeZone: "America/Santiago", hour: "2-digit", minute: "2-digit", hour12: false };
        const formatoChile = new Intl.DateTimeFormat("es-CL", opciones).formatToParts(fecha);
        
        //Parse de Horas y minutos actual para calculo de turno
        const hora = parseInt(formatoChile[0].value, 10); 
        const minutos = parseInt(formatoChile[2].value, 10);

        console.log(hora);
        console.log(minutos);

        //Condicionales calculo de turno
        if ((hora === 7 && minutos >= 0) || (hora > 7 && hora < 14) || (hora === 14 && minutos < 30)) {
            return "Mañana";
        } else if ((hora === 14 && minutos >= 30) || (hora > 14 && hora < 23)) {
            return "Tarde";
        } else {
            return "Noche";
        }
    }

    function obtenerFechaHoraChile() {
        const fechaUTC = new Date();
        const opciones = { timeZone: "America/Santiago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
        const formatoChile = new Intl.DateTimeFormat("es-CL", opciones).formatToParts(fechaUTC);
        
        let fechaChileISO = `${formatoChile[4].value}-${formatoChile[2].value}-${formatoChile[0].value}T${formatoChile[6].value}:${formatoChile[8].value}:${formatoChile[10].value}Z`;
        return fechaChileISO;
    }

    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Obtiene el valor del atributo 'data-task' del botón presionado
            const selectedTask = button.getAttribute('data-task').toLowerCase();

            // Almacena en sessionStorage para compatibilidad con código existente
            sessionStorage.setItem('selectedTask', selectedTask);

            // Recupera el array desde localStorage o crea uno nuevo si no existe
            let tareaActual = JSON.parse(localStorage.getItem('tareaActual')) || [];

            const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
            console.log(usuario.name, usuario.email);

            // Genera la fecha actual en formato ISO considerando la hora de Chile
            const fechaChileISO = obtenerFechaHoraChile();

            console.log(fechaChileISO);
            
            // Crea un nuevo objeto de tarea con el turno calculado
            let nuevaTarea = {
                codigoTarea: selectedTask,
                operacionInicio: fechaChileISO,
                fecha: fechaChileISO,
                turno: determinarTurno(fechaChileISO)
            };

            console.log("Nueva tarea guardada:", nuevaTarea);

            // Agrega la nueva tarea al array
            tareaActual.push(nuevaTarea);

            // Guarda el array actualizado en localStorage
            localStorage.setItem('tareaActual', JSON.stringify(tareaActual));

            // Redirige a la pantalla de espera
            window.location.href = '/tareas/espera';
        });
    });

    // Obtiene el botón de cerrar sesión por su ID
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Limpia sessionStorage y localStorage al cerrar sesión
            sessionStorage.clear();
            localStorage.clear();
            localStorage.removeItem('tareaActual');

            // Redirige al usuario a la página de inicio de sesión
            window.location.href = '/';
        });
    }
});