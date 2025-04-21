// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {

    // Obtiene el formulario de recuperación de contraseña
    const recuperarForm = document.getElementById('recuperarForm');

    // Agrega un evento al formulario para manejar el envío de datos
    recuperarForm.addEventListener('submit', function(event) {
        // Evita que el formulario se envíe y recargue la página
        event.preventDefault();

        // Obtiene el valor ingresado en el campo de correo electrónico
        const email = document.getElementById('email').value;

        // Verifica si el usuario ingresó un correo válido
        if (email) {
            // Muestra una alerta indicando que se enviaron instrucciones al correo
            alert("Instrucciones enviadas a " + email);
            // Redirige al usuario a la página principal (index.html)
            window.location.href = "index.html";
        } else {
            // Muestra una alerta indicando que el correo no es válido
            alert("Por favor, ingresa un correo válido.");
        }
    });
});
