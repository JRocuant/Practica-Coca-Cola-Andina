// Función que verifica el rol del usuario y redirige a la página correspondiente
function checkSession() {
    // Obtener el rol del usuario desde sessionStorage
    const userRole = sessionStorage.getItem('userRole');

    /* Si el usuario es operador, redirigir a la pantalla de selección de tarea */
    if (userRole === 'operador') {
        window.location.href = 'selecciontarea.html';
    }
    /* Si el usuario es administrador, redirigir al dashboard */
    else if (userRole === 'admin') {
        window.location.href = 'dashboard.html';
    }
}

// Ejecutar la función cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    checkSession(); // Llamamos a la función para verificar la sesión
});
